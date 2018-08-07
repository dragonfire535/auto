module.exports = value => {
	if (!value) return null;
	return encodeURIComponent(value);
};
