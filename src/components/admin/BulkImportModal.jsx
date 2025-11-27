import { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, Check, Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { slugify } from '../../lib/stringUtils';
import { SUPERMARKETS } from '../../lib/types';

export default function BulkImportModal({ onClose, onImportSuccess }) {
    const [step, setStep] = useState('upload'); // upload, preview, importing, success
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [importStats, setImportStats] = useState({ products: 0, categories: 0 });
    const fileInputRef = useRef(null);

    const downloadTemplate = () => {
        const headers = ['Name', 'Category', 'Image URL', 'Barcode', ...SUPERMARKETS.map(s => `${s.name} Price`)];
        const exampleRow = ['Milk 500ml', 'Dairy', 'https://example.com/image.jpg', '123456789', ...SUPERMARKETS.map(() => '50')];

        const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "twende_product_import_template.xlsx");
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws);
                validateData(jsonData);
            } catch (error) {
                console.error("Error reading file:", error);
                setErrors(["Failed to read file. Please ensure it's a valid Excel file."]);
            }
        };
        reader.readAsBinaryString(uploadedFile);
    };

    const validateData = (jsonData) => {
        const validData = [];
        const validationErrors = [];

        jsonData.forEach((row, index) => {
            const rowNum = index + 2; // +2 for header and 0-index
            if (!row.Name || !row.Category) {
                validationErrors.push(`Row ${rowNum}: Missing Name or Category`);
                return;
            }

            // Basic validation passed
            validData.push(row);
        });

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors([]);
        }

        setData(validData);
        setStep('preview');
    };

    const handleImport = async () => {
        setStep('importing');
        try {
            const batch = writeBatch(db);
            const categoriesSet = new Set();
            let newProductsCount = 0;

            // 1. Fetch existing categories to minimize reads
            const catsSnapshot = await getDocs(collection(db, 'categories'));
            const existingCategories = new Set(catsSnapshot.docs.map(d => d.id));

            for (const row of data) {
                const categoryName = row.Category.trim();
                const categoryId = slugify(categoryName);

                // Add Category if new
                if (!existingCategories.has(categoryId) && !categoriesSet.has(categoryId)) {
                    const catRef = doc(db, 'categories', categoryId);
                    batch.set(catRef, {
                        name: categoryName,
                        productCount: 0,
                        createdAt: new Date()
                    });
                    categoriesSet.add(categoryId);
                }

                // Create Product
                const productId = `${categoryId.substring(0, 2)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                const productRef = doc(db, 'products', productId);

                batch.set(productRef, {
                    name: row.Name,
                    category: categoryName,
                    image: row['Image URL'] || 'https://placehold.co/200x200?text=No+Image',
                    barcode: row.Barcode || '',
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    viewCount: 0,
                    isTrending: false
                });

                // Create Prices
                const pricesRef = doc(db, 'prices', productId);
                const pricesMap = {};

                SUPERMARKETS.forEach(supermarket => {
                    const priceKey = `${supermarket.name} Price`;
                    const priceVal = row[priceKey];

                    pricesMap[supermarket.id] = {
                        price: priceVal ? Number(priceVal) : 0,
                        location: '',
                        updatedAt: new Date()
                    };
                });

                batch.set(pricesRef, {
                    productId,
                    prices: pricesMap,
                    lastUpdated: new Date(),
                    verified: true
                });

                newProductsCount++;
            }

            await batch.commit();
            setImportStats({ products: newProductsCount, categories: categoriesSet.size });
            setStep('success');
            if (onImportSuccess) onImportSuccess();

        } catch (error) {
            console.error("Import failed:", error);
            setErrors(["Import failed. Please try again."]);
            setStep('preview');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Bulk Import Products</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'upload' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-blue-900">Instructions</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        1. Download the template.<br />
                                        2. Fill in your product data.<br />
                                        3. Upload the Excel file here.<br />
                                        Categories will be created automatically if they don't exist.
                                    </p>
                                    <button
                                        onClick={downloadTemplate}
                                        className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Template
                                    </button>
                                </div>
                            </div>

                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-all"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-600 font-medium">Click to upload Excel file</p>
                                <p className="text-sm text-gray-400 mt-1">.xlsx or .xls files</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Preview ({data.length} items)</h3>
                                <button
                                    onClick={() => { setStep('upload'); }}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Change File
                                </button>
                            </div>

                            {errors.length > 0 ? (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-red-900 mb-2">Validation Errors</h4>
                                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                        {errors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </div>
                            ) : (
                                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (Est)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.slice(0, 5).map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{row.Name}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">{row.Category}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">
                                                        {row[`${SUPERMARKETS[0].name} Price`] || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {data.length > 5 && (
                                        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center">
                                            And {data.length - 5} more...
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('upload')}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImport}
                                    disabled={errors.length > 0}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Import {data.length} Products
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'importing' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Importing Data...</h3>
                            <p className="text-gray-500">Please wait while we process your file.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Import Successful!</h3>
                            <p className="text-gray-600 mb-6">
                                Added {importStats.products} products and {importStats.categories} new categories.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
