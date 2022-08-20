import { readonly, ref, type Ref } from "vue";

type handleParts = "left" | "right" | "top" | "down";

type AbleToMove = "left" | "right" | "top" | "down";

type MoveAction = "move-top" | "move-down" | "move-left" | "move-right" | null;

type Parts = {
  number: number;
  ableToMove: AbleToMove | null;
  selected: boolean;
  action: MoveAction;
};

type PartsList = Array<Parts | null>;

export const useParts = () => {
  const partsList: Ref<PartsList> = ref([
    { number: 1, ableToMove: null, selected: false, action: null },
    { number: 2, ableToMove: null, selected: false, action: null },
    { number: 3, ableToMove: null, selected: false, action: null },
    { number: 4, ableToMove: null, selected: false, action: null },
    { number: 5, ableToMove: null, selected: false, action: null },
    { number: 6, ableToMove: null, selected: false, action: null },
    { number: 7, ableToMove: null, selected: false, action: null },
    { number: 8, ableToMove: null, selected: false, action: null },
    { number: 9, ableToMove: null, selected: false, action: null },
    { number: 10, ableToMove: null, selected: false, action: null },
    { number: 11, ableToMove: null, selected: false, action: null },
    { number: 12, ableToMove: null, selected: false, action: null },
    { number: 13, ableToMove: null, selected: false, action: null },
    { number: 14, ableToMove: null, selected: false, action: null },
    { number: 15, ableToMove: null, selected: false, action: null },
    null,
  ]);

  const getPartsList = () => partsList.value;

  const init = () => {
    partsList.value = [
      { number: 1, ableToMove: null, selected: false, action: null },
      { number: 2, ableToMove: null, selected: false, action: null },
      { number: 3, ableToMove: null, selected: false, action: null },
      { number: 4, ableToMove: null, selected: false, action: null },
      { number: 5, ableToMove: null, selected: false, action: null },
      { number: 6, ableToMove: null, selected: false, action: null },
      { number: 7, ableToMove: null, selected: false, action: null },
      { number: 8, ableToMove: null, selected: false, action: null },
      { number: 9, ableToMove: null, selected: false, action: null },
      { number: 10, ableToMove: null, selected: false, action: null },
      { number: 11, ableToMove: null, selected: false, action: null },
      { number: 12, ableToMove: null, selected: false, action: null },
      { number: 13, ableToMove: null, selected: false, action: null },
      { number: 14, ableToMove: null, selected: false, action: null },
      { number: 15, ableToMove: null, selected: false, action: null },
      null,
    ];
  };

  /**
   * partsListの中身をシャッフルする
   *
   */
  const shuffleParts = () => {
    init();
    changePartsStatusToMove();
    // moveできるパーツを取得する
    for (let i = 0; i < 300; i += 1) {
      const canMoveDirections = partsList.value.reduce<Array<AbleToMove>>(
        (ar, cu) => {
          const ableToMove = cu?.ableToMove;
          if (!ableToMove) {
            return ar;
          }
          return [...ar, ableToMove];
        },
        []
      );
      const handleMove =
        canMoveDirections[Math.trunc(Math.random() * canMoveDirections.length)];
      moveParts(handleMove);
      changePartsToEmpty();
      changePartsStatusToMove();
    }
    // console.log(partsList.value);
    // const array = partsList.value;
    // for (let i = array.length - 1; 0 < i; i--) {
    //   // 0〜(i+1)の範囲で値を取得
    //   const r = Math.floor(Math.random() * (i + 1));

    //   // 要素の並び替えを実行
    //   const tmp = array[i];
    //   array[i] = array[r];
    //   array[r] = tmp;
    // }
    // partsList.value = array;
  };

  /**
   * 完成している
   *
   */
  const isComplete = () =>
    partsList.value.map((p) => p?.number || null).toString() ===
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null].toString();

  /**
   * 動かせるパーツに対して、フラグを設定する
   *
   */
  const changePartsStatusToMove = () => {
    // 上下左右に空きがあるか確認
    partsList.value = partsList.value.reduce<PartsList>((ar, cu, ci, array) => {
      if (cu === null) {
        return [...ar, cu];
      }
      // 上下左右のパーツの取得する
      const checked: {
        top: Parts | "wall" | null;
        left: Parts | "wall" | null;
        right: Parts | "wall" | null;
        down: Parts | "wall" | null;
      } = {
        top: array[ci - 4],
        left: ci % 4 !== 0 ? array[ci - 1] : "wall",
        right: ci % 4 !== 3 ? array[ci + 1] : "wall",
        down: array[ci + 4],
      };
      const ableToMove = (<Array<AbleToMove>>(
        Object.keys(checked)
      )).reduce<AbleToMove | null>(
        (ar, cu) => (checked[cu] === null ? cu : ar),
        null
      );
      if (ableToMove) {
        return [
          ...ar,
          {
            ...cu,
            ableToMove,
          },
        ];
      }
      return [...ar, cu];
    }, []);
  };

  /**
   * 選択ずみパーツを取得する
   *
   * @return {*}  {(Parts | null)}
   */
  const getSelectedParts = (): Parts | null =>
    partsList.value.find(
      (parts) => parts !== null && parts.selected && parts.ableToMove !== null
    ) || null;

  /**
   * パーツを選択状態にする
   * ableToMoveがnullでないこと
   *
   * @param {number} partsNumber
   */
  const setSelectedParts = (partsNumber: number) => {
    partsList.value = partsList.value.map((parts) => {
      if (parts === null) {
        return parts;
      }
      return {
        ...parts,
        selected: partsNumber === parts.number && parts.ableToMove !== null,
      };
    });
  };

  /**
   * 選択済みのパーツ有無
   *
   */
  const hasSelectedParts = () =>
    partsList.value.some((parts) => parts !== null && parts.selected);

  /**
   * パーツのステータスを全てクリアする（nullは無視する）
   *
   */
  const statusClearAll = () => {
    partsList.value = partsList.value.map((parts) => {
      if (parts === null) {
        return parts;
      }
      return {
        ...parts,
        ableToMove: null,
        selected: false,
        action: null,
      };
    });
  };

  const activeParts = (): Parts | null =>
    partsList.value.find((parts) => parts !== null && parts.action !== null) ||
    null;

  /**
   * 選択済みパーツとemptyをチェンジする
   *
   */
  const changePartsToEmpty = () => {
    const ap = activeParts();
    if (!ap) {
      return;
    }
    partsList.value = partsList.value.reduce<PartsList>((ar, cu) => {
      if (cu === null) {
        return [
          ...ar,
          {
            ...ap,
            ableToMove: null,
            selected: false,
            action: null,
          },
        ];
      }
      if (cu === ap) {
        return [...ar, null];
      }
      return [
        ...ar,
        {
          ...cu,
          ableToMove: null,
          selected: false,
          action: null,
        },
      ];
    }, []);
  };

  const moveParts = async (partsName: handleParts) => {
    partsList.value = partsList.value.map((parts) => {
      if (parts === null) {
        return parts;
      }
      if (parts.ableToMove === partsName) {
        return {
          ...parts,
          selected: true,
          action: `move-${partsName}`,
        };
      }
      return parts;
    });

    await new Promise((resolve) =>
      window.setTimeout(() => {
        changePartsToEmpty();
        changePartsStatusToMove();
        resolve(null);
      }, 100)
    );
  };

  return {
    partsList: readonly(partsList),
    init,
    getPartsList,
    shuffleParts,
    isComplete,
    changePartsStatusToMove,
    getSelectedParts,
    setSelectedParts,
    hasSelectedParts,
    statusClearAll,
    changePartsToEmpty,
    activeParts,
    moveParts,
  };
};
