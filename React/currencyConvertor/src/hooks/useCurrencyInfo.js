import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
  const [data, setData] = useState({});
  
  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
      .then((response) => response.json())
      .then((res) => setData(res.rates)) // Update here to store rates object
      .catch((error) => console.error("Failed to fetch currency data:", error));
  }, [currency]);

  return data;
}

export default useCurrencyInfo;
