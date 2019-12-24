let max = 0
let amount = 0

const addManualInputs = () => {
  if (max === amount) {
    alert("투자금이 부족합니다.")
    return
  }
  const textbox = document.createElement("input")
  textbox.setAttribute("type", "text")
  textbox.setAttribute("name", "manualNumbers[" + amount + "]")
  const manualNumbersContainer = document.getElementById("manualNumbersContainer")
  manualNumbersContainer.appendChild(textbox)
  manualNumbersContainer.appendChild(document.createElement("br"))
  if (++amount === 1) {
    document.getElementById("guide").innerText = "쉼표로 6개의 번호를 구분하여 입력해주세요."
  }
}

const removeManualInputs = () => {
  if (amount > 0) {
    const container = document.getElementById("manualNumbersContainer")
    container.removeChild(container.lastChild)
    container.removeChild(container.lastChild)
    if (--amount === 0) {
      document.getElementById("guide").innerText = ""
    }
  }
}

const resetManualInputs = () => {
  const investment = document.getElementById("investment")
  if (investment.value < 0 || isNaN(investment.value)) {
      investment.value = 0
  }
  max = Math.floor(investment.value / price)
  while (max < amount) {
    removeManualInputs()
  }
}

const deleteFrontPage = () => {
  document.getElementById("front_page").outerHTML = ""
}
