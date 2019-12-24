let price

(async () => {
  try {
    price = (await axios.get("/api/price")).data.amount
    document.getElementById("priceFormatted").innerText = new Intl.NumberFormat(
        "ko-KR",
        { style: "currency", currency: "KRW" }
    ).format(price)
  } catch (e) {}
})()

const submit = async type => {
  const data = Object.fromEntries(new FormData(document.getElementById(type)))
  try {
    const result = (await axios.post(
      "/api" + type,
      data, {
        headers: {
          "Content-Type": "application/json"
        }
      })).data
    deleteFrontPage()
    document.getElementById("result_page").innerHTML = result
  } catch (e) {
    deleteFrontPage()
    document.getElementById("result_page").innerHTML = e.response.data
  }
}

const submitHistory = () => submit("history")

const submitPurchase = () => submit("purchase")
