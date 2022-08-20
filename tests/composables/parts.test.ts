import { useParts } from "@/composables/parts";
const {
  init,
  getPartsList,
  shuffleParts,
  isComplete,
  changePartsStatusToMove,
  setSelectedParts,
} = useParts();
describe("partsList", () => {
  it("パーツが取得されること", () => {
    expect(getPartsList().length).toBe(16);
  });

  it("パーツが完成されてるステータスになっていること", () => {
    expect(isComplete()).toBe(true);
  });

  it("パーツが完成されてるステータスになっていないこと（パーツシャッフル後）", () => {
    shuffleParts();
    expect(isComplete()).toBe(false);
  });

  it("パーツが動かせる設定が正しいこと（ここでは12,15）", () => {
    init();
    changePartsStatusToMove();
    expect(
      getPartsList()
        .filter((parts) => parts && parts.ableToMove !== null)
        .map((parts) => ({
          number: parts.number,
          ableToMove: parts.ableToMove,
        }))
    ).toEqual([
      {
        number: 12,
        ableToMove: "down",
      },
      {
        number: 15,
        ableToMove: "right",
      },
    ]);
  });

  it("指定したパーツを選択済みの状態にすること", () => {
    init();
    changePartsStatusToMove();
    setSelectedParts(15);
    // moveできるパーツは選択済み可能
    expect(getPartsList()[14].selected).toBe(true);

    setSelectedParts(15);
    // moveできないパーツは選択不可
    expect(getPartsList()[13].selected).toBe(false);
  });
});
