import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (
	date: Date | string,
	formatStr = 'MMM d, yyyy'
): string => {
	const dateObj = typeof date === 'string' ? parseISO(date) : date;
	if (!isValid(dateObj)) return '';
	return format(dateObj, formatStr);
};

export const formatDateTime = (date: Date | string): string => {
	return formatDate(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? parseISO(date) : date;
	if (!isValid(dateObj)) return '';
	return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatAccountCode = (code: string): string => {
	// Format account codes like "1000" to "1000"
	return code.padStart(4, '0');
};

export const formatAccountName = (account: {
	code: string;
	name: string;
}): string => {
	return `${formatAccountCode(account.code)} - ${account.name}`;
};

export const formatInvoiceNumber = (number: string, prefix = 'INV'): string => {
	return `${prefix}-${number.padStart(4, '0')}`;
};

export const formatBillNumber = (number: string, prefix = 'BILL'): string => {
	return `${prefix}-${number.padStart(4, '0')}`;
};

export const getInitials = (name: string): string => {
	return name
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase())
		.slice(0, 2)
		.join('');
};

export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + '...';
};
