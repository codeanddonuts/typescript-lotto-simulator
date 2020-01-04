export class Templates {
  bakeFrontPage(price, maxPurchaseAmount, recentRound) {
    const formattedPrice = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price)
    return `
      <div id="front-page" class="inner">
        <header class="special">
          <h2>장당 ${formattedPrice}, 최대 ${maxPurchaseAmount}장</h2>
          <p>(수동으로 입력하지 않은 만큼은 자동 발권됩니다.)</p>
        </header>
        <section>
          <div class="content">
          <form id="purchase">
              투자금 : <input id="investment" type="text" value="0" />
              <br />
              <div class="right">
                수동 번호 입력 :
                <input id="add-manual-inputs" type="button" value="+" />
                <input id="remove-manual-inputs" type="button" value="-" />
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
                  <select id="round">
                    <option value="${recentRound}" selected>${recentRound}회</option>
                  </select>
                  <br />
                  <input id="submit-purchase" type="button" value="구매하기" />
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    `
  }

  bakeRoundOptions(recentRound) {
    return Array.from(Array(recentRound - 1).keys()).reverse()
                                                    .map(i => `<option value="${i + 1}">${i + 1}회</option>`)
                                                    .reduce((a, b) => a + b, "")
  }

  bakeResultPage(result) {
    const resultTemplate = ({ totalPurchaseAmount, totalPrize }) => `
      <section>
        <div class="content">
          <b>제 {round}회</b> : {winningNumbers}
        </div>
        <br />
        <div class="content">
          {purchasedLottos}
        </div>
        <br />
        <div class="content">
          ${totalPurchaseAmount}줄 구매, ${totalPrize}원 당첨
        </div>
      </section>
    `
    const view = result.data.purchase ? resultTemplate(result.data.purchase) : result.errors[0].message
    return '<div id="result-page" class="inner center">' + view + '<br /><br /><br /><button id="replay">다시 플레이</button>'
  }
}
