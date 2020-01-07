export class ViewTemplates {
  bakeFrontPage({ price, maxPurchaseAmount, recentRound }) {
    const template = document.createElement("template")
    const formattedPrice = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price)
    template.insertAdjacentHTML(
        "afterbegin",
        `<div id="front-page" class="inner">
          <header class="special">
            <h2>게임당 ${formattedPrice}, 최대 ${maxPurchaseAmount} 게임</h2>
            <p>(수동으로 입력하지 않은 만큼은 자동 발권됩니다.)</p>
          </header>
          <section>
            <div class="content">
            <form id="manual-picks">
                투자금 : <input id="investment" type="text" value="0" />
                <br />
                <div class="right">
                  수동 번호 입력 :
                  <input id="add-manual-pick" type="button" value="+" />
                  <input id="remove-manual-pick" type="button" value="-" />
                </div>
                <br />
                <br />
                <p id="manual-picks-container"></p>
                <p class="right">
                  <i id="guide"></i>
                </p>
                <br />
                <br />
                <div class="right" style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 10px; grid-auto-rows: minmax(100px, auto);">
                  <div style="grid-column: 3;">
                    <select id="rounds">
                      <option value="${recentRound}" selected>${recentRound}회</option>
                      ${this.bakeRoundOptions(recentRound)}
                    </select>
                    <br />
                    <input id="purchase" type="button" value="구매하기" />
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>`
    )
    return Array.from(template.childNodes.values()).filter(x => x.nodeType === Node.ELEMENT_NODE)[0]
  }

  bakeRoundOptions(recentRound) {
    return Array.from(Array(recentRound - 1).keys(), i => `<option value="${i + 1}">${i + 1}회</option>`).reverse().join("")
  }

  bakeManualInputBox() {
    return '<input class="manual-pick" type="text" name="manual-pick"><br />'
  }

  bakeResultPage({ round, games, winningNumbers, totalPrize }) {
    return `
      <div id="result-page" class="inner center">
        <section>
          <div class="content">
            <b>제 ${round}회</b> : ${this.formatWinningNumbers(winningNumbers)}
          </div>
          <br />
          <div class="content">
            <b>${games.length}줄 구매<br />${totalPrize}원 당첨</b>
          </div>
          <br />
          <div class="content">
            ${this.formatLottos(games)}
          </div>
        </section>
      <br />
      <br />
      <br />
      <button id="replay">다시 플레이</button>
    `
  }

  formatWinningNumbers({ mains, bonus }) {
    return mains.map(n => `<span class="ball color${Math.floor(n / 10)}">${n}</span>`).join("")
    + ` + <span class="ball color5">${bonus}</span>`
  }

  formatLottos(games) {
    return games.map(game => `<span class="lotto">${game}</span>`).join("<br />")
  }
}
