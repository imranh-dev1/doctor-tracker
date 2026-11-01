const parseDate = (value?: string, endOfDay = false) => {
	if (!value) {
		return undefined;
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return undefined;
	}

	if (endOfDay) {
		date.setHours(23, 59, 59, 999);
	} else {
		date.setHours(0, 0, 0, 0);
	}

	return date;
};

export const buildDateRange = (fromDate?: string, toDate?: string) => {
	const from = parseDate(fromDate);
	const to = parseDate(toDate, true);

	if (!from && !to) {
		return undefined;
	}

	const range: { $gte?: Date; $lte?: Date } = {};

	if (from) {
		range.$gte = from;
	}

	if (to) {
		range.$lte = to;
	}

	return range;
};
