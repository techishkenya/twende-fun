import { Clock, CheckCircle, XCircle, MapPin, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SUPERMARKETS } from '../lib/types';

export default function SubmissionCard({ submission, onEdit }) {
    const supermarketName = SUPERMARKETS.find(s => s.id === submission.supermarketId)?.name || submission.supermarketId;

    const isPending = submission.status === 'pending';
    const isEditable = isPending && (new Date() - submission.createdAt.toDate() < 60 * 60 * 1000); // 1 hour

    const statusConfig = {
        pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending Review' },
        approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Approved' },
        rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Rejected' }
    };

    const status = statusConfig[submission.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <img
                        src={submission.productImage || 'https://placehold.co/100x100?text=Product'}
                        alt={submission.productName}
                        className="h-12 w-12 object-contain rounded-lg bg-gray-50"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900">{submission.productName}</h3>
                        <p className="text-sm text-gray-500">{supermarketName}</p>
                    </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pl-14">
                <div>
                    <p className="text-lg font-bold text-gray-900">KES {submission.price}</p>
                    {submission.branch && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {submission.branch}
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400">
                        {formatDistanceToNow(submission.createdAt.toDate(), { addSuffix: true })}
                    </p>
                    {isEditable && (
                        <button
                            onClick={() => onEdit(submission)}
                            className="mt-2 text-primary-600 text-xs font-medium flex items-center gap-1 hover:text-primary-700"
                        >
                            <Edit2 className="h-3 w-3" />
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
