const filter = rxjs.operators.filter
const map = rxjs.operators.map

export const intent = () => {
  return {
    changeInvestment$: rxjs.fromEvent(document, "change").pipe(
        filter(event => event.target.id === "investment"),
        map(event => event.target.value)
    ),
    changeManualPick$: rxjs.fromEvent(document, "change").pipe(
        filter(event => event.target.classList.contains("manual-pick")),
        map(event => event.target)
    ),
    clickAddButton$: rxjs.fromEvent(document, "click").pipe(filter(event => event.target.id === "add-manual-pick")),
    clickRemoveButton$: rxjs.fromEvent(document, "click").pipe(filter(event => event.target.id === "remove-manual-pick")),
    submitPurchase$: rxjs.fromEvent(document, "click").pipe(
        filter(event => event.target.id === "purchase"),
        map(() => ({
          investment: document.getElementById("investment").value,
          manualPicks: new FormData(document.getElementById("manual-picks")),
          round: document.getElementById("rounds").value
        }))
    ),
    submitReplay$: rxjs.fromEvent(document, "click").pipe(filter(event => event.target.id === "replay"))
  }
}
