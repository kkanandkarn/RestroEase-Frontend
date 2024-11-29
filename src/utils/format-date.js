function formatDate(date) {
  const newDate = new Date(date);
  const formattedDate = newDate
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(",", "");
  return formattedDate;
}
export default formatDate;
