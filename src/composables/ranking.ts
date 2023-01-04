import { readonly, ref } from 'vue';
import dayjs from 'dayjs';

export type Ranking = {
  time: string;
  moves: number;
};

let timer = 0;

let startDate: dayjs.Dayjs;

export const useRanking = () => {
  const status = ref<Ranking>({
    time: '00:00',
    moves: 0,
  });

  const getStatus = () => status.value;

  const resetStatus = () => {
    status.value = {
      time: '00:00',
      moves: 0,
    };
  };

  const addMoveCount = () => {
    status.value.moves += 1;
  };

  const startTimer = () => {
    startDate = dayjs();
    timer = window.setInterval(() => {
      status.value.time = dayjs(dayjs().diff(startDate)).format('mm:ss');
    }, 1000);
  };

  const stopTimer = () => {
    window.clearInterval(timer);
  };

  /**
   * localStorageからランキングを取得する
   *
   * @return {*}
   */
  const getRanking = (): Array<Ranking> => getLocalStorage().splice(0, 5);

  const insertRanking = (rank: Ranking) => {
    const ranking = getLocalStorage();
    if (ranking.length === 0) {
      setLocalStorage([
        {
          time: rank.time,
          moves: rank.moves,
        },
      ]);
      return;
    }
    ranking.push(rank);
    const edittedRanking = ranking.sort((a, b) => {
      if (a.moves >= b.moves) {
        return 1;
      } else if (a.moves < b.moves) {
        return -1;
      }
      return 0;
    });
    setLocalStorage(edittedRanking.splice(0, 5));
  };

  const setLocalStorage = (ranking: Array<Ranking>) => {
    window.localStorage.setItem('ranking', JSON.stringify(ranking));
  };

  const getLocalStorage = (): Array<Ranking> =>
    JSON.parse(window.localStorage.getItem('ranking') || '[]');

  return {
    status: readonly(status),
    startTimer,
    stopTimer,
    getStatus,
    resetStatus,
    addMoveCount,
    getRanking,
    insertRanking,
    setLocalStorage,
    getLocalStorage,
  };
};
