const formatDate = (date) => {
  const updatedAt = new Date(date);
  const day = String(updatedAt.getDate()).padStart(2, "0");
  const month = String(updatedAt.getMonth() + 1).padStart(2, "0");
  const year = updatedAt.getFullYear();
  return `${day}/${month}/${year}`;
};

module.exports = { formatDate };
