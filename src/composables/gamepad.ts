type Init = ({
  connected,
  disconnected,
  down,
  up,
  left,
  right,
}: {
  connected: (gamePadId: string) => void;
  disconnected: (gamePadId: string) => void;
  down: () => void;
  up: () => void;
  left: () => void;
  right: () => void;
}) => void;

type ButtonsStatus = {
  A: boolean;
  B: boolean;
  P: boolean;
  R: boolean;
  S: boolean;
  HIDE: boolean;
  DIRECTION_L: boolean;
  DIRECTION_R: boolean;
  DIRECTION_D: boolean;
  DIRECTION_U: boolean;
  DIRECTION_LD: boolean;
  DIRECTION_LU: boolean;
  DIRECTION_RD: boolean;
  DIRECTION_RU: boolean;
};

type ButtonsDirectionalStatus = {
  DIRECTION_L: boolean;
  DIRECTION_R: boolean;
  DIRECTION_D: boolean;
  DIRECTION_U: boolean;
};

/**
 * ゲームパッドクラス
 * GamepadAPIを使用する
 * ここではキーボード、タッチイベントの挙動を考慮して、
 * 現在のステータス、その直前のステータスを用意し、
 * それぞれのボタンを比較して不一致の場合、translatorを実行する
 *
 * @export
 * @class GamepadDevice
 */
export class GamepadDevice {
  private connectedGamepadIndex: number | null = null;

  private doConnected: ((gamePadId: string) => void) | null = null;

  private doDisconnected: ((gamePadId: string) => void) | null = null;

  private doDirection: {
    down: () => void;
    up: () => void;
    left: () => void;
    right: () => void;
  } | null = null;

  // 方向キー（ジャイロ）現時点のボタンステータス
  private buttonsStatus: ButtonsStatus;

  // 方向キー（ジャイロ）現時点から1つ手前のボタンステータス
  private prevButtonsStatus: ButtonsStatus;

  // 方向キー（ボタン）のボタンステータス
  private buttonsDirectionalStatus: ButtonsDirectionalStatus;

  private axesDeadzone = 0.6;

  constructor() {
    this.buttonsStatus = {
      A: false,
      B: false,
      P: false,
      R: false,
      S: false,
      HIDE: false,
      DIRECTION_L: false,
      DIRECTION_R: false,
      DIRECTION_D: false,
      DIRECTION_U: false,
      DIRECTION_LD: false,
      DIRECTION_LU: false,
      DIRECTION_RD: false,
      DIRECTION_RU: false,
    };
    this.buttonsDirectionalStatus = {
      DIRECTION_L: false,
      DIRECTION_R: false,
      DIRECTION_D: false,
      DIRECTION_U: false,
    };
    this.prevButtonsStatus = {
      ...this.buttonsStatus,
    };
  }

  /**
   * ボタンステータスをリセットする
   *
   * @private
   * @memberof GamepadDevice
   */
  private resetButtons = () => {
    this.buttonsStatus = {
      A: false,
      B: false,
      P: false,
      R: false,
      S: false,
      HIDE: false,
      DIRECTION_L: false,
      DIRECTION_R: false,
      DIRECTION_D: false,
      DIRECTION_U: false,
      DIRECTION_LD: false,
      DIRECTION_LU: false,
      DIRECTION_RD: false,
      DIRECTION_RU: false,
    };
  };

  /**
   * 初期化
   *
   * @memberof Abstract
   */
  public init: Init = ({ connected, disconnected, down, up, left, right }) => {
    this.doConnected = connected;
    this.doDisconnected = disconnected;
    this.doDirection = {
      down,
      up,
      left,
      right,
    };
    window.addEventListener('gamepadconnected', this.connected);
    window.addEventListener('gamepaddisconnected', this.disconnected);
  };

  /**
   * リセット
   * ゲームパッドイベントを削除する
   *
   * @memberof GamepadDevice
   */
  public reset = () => {
    window.removeEventListener('gamepadconnected', this.connected);
    window.removeEventListener('gamepaddisconnected', this.disconnected);
  };

  public do = () => {
    if (this.connectedGamepadIndex === null) {
      return;
    }
    this.resetButtons();
    const gamepads = navigator.getGamepads();
    const gp = gamepads[this.connectedGamepadIndex];

    // ボタンが押されているかどうかを取得。
    //   BUTTON_A_INDEX: 0,
    //   BUTTON_B_INDEX: 1,
    //   BUTTON_X_INDEX: 2,
    //   BUTTON_Y_INDEX: 3,
    //   BUTTON_LB_INDEX: 4,
    //   BUTTON_RB_INDEX: 5,
    //   BUTTON_LT_INDEX: 6,
    //   BUTTON_RT_INDEX: 7,
    //   BUTTON_BACK_INDEX: 8,
    //   BUTTON_START_INDEX: 9,
    //   BUTTON_L3_INDEX: 10,
    //   BUTTON_R3_INDEX: 11,
    //   BUTTON_UP_INDEX: 12,
    //   BUTTON_DOWN_INDEX: 13,
    //   BUTTON_LEFT_INDEX: 14,
    //   BUTTON_RIGHT_INDEX: 15,
    //   BUTTON_HOME_INDEX: 16,
    this.buttonsStatus.A = gp?.buttons[0]?.pressed || false;
    this.buttonsStatus.B = gp?.buttons[1]?.pressed || false;
    this.buttonsStatus.R = gp?.buttons[4]?.pressed || false;
    this.buttonsStatus.S = gp?.buttons[5]?.pressed || false;
    this.buttonsStatus.P = gp?.buttons[9]?.pressed || false;
    this.buttonsStatus.HIDE = gp?.buttons[7]?.pressed || false;

    this.buttonsStatus.DIRECTION_U =
      (gp?.buttons[12]?.pressed && gp?.buttons[12]?.value === 1.0) || false;
    this.buttonsStatus.DIRECTION_D =
      (gp?.buttons[13]?.pressed && gp?.buttons[13]?.value === 1.0) || false;
    this.buttonsStatus.DIRECTION_L =
      (gp?.buttons[14]?.pressed && gp?.buttons[14]?.value === 1.0) || false;
    this.buttonsStatus.DIRECTION_R =
      (gp?.buttons[15]?.pressed && gp?.buttons[15]?.value === 1.0) || false;

    // スティック設定
    this.setAxes(gp?.axes);

    // 直前のステータスと比較する
    // 不一致の場合、そのボタンに対してフラグをつけてtranslatorに送信する
    (<Array<keyof ButtonsStatus>>Object.keys(this.buttonsStatus)).forEach(
      (button) => {
        if (this.buttonsStatus[button] !== this.prevButtonsStatus[button]) {
          switch (button) {
            case 'DIRECTION_U':
              this.buttonsStatus[button] && this.doDirection?.up();
              break;
            case 'DIRECTION_D':
              this.buttonsStatus[button] && this.doDirection?.down();
              break;
            case 'DIRECTION_L':
              this.buttonsStatus[button] && this.doDirection?.left();
              break;
            case 'DIRECTION_R':
              this.buttonsStatus[button] && this.doDirection?.right();
              break;
            default:
          }
        }
        this.prevButtonsStatus[button] = this.buttonsStatus[button];
      }
    );
  };

  /**
   * スティックの操作
   *
   * @private
   * @param {Gamepad['axes']} axes
   * @memberof GamepadDevice
   */
  private setAxes = (axes?: Gamepad['axes']) => {
    const [leftAxesHorizontal, leftAxesVertical] = axes || [0, 0];
    if (leftAxesHorizontal === undefined || leftAxesVertical === undefined) {
      return;
    }
    if (
      leftAxesHorizontal > this.axesDeadzone &&
      Math.abs(leftAxesVertical) < this.axesDeadzone
    ) {
      // console.log('R');
      this.buttonsStatus.DIRECTION_R = true;
    } else if (
      leftAxesHorizontal < this.axesDeadzone * -1 &&
      Math.abs(leftAxesVertical) < this.axesDeadzone
    ) {
      // console.log('L');
      this.buttonsStatus.DIRECTION_L = true;
    } else if (
      Math.abs(leftAxesHorizontal) < this.axesDeadzone &&
      leftAxesVertical > this.axesDeadzone
    ) {
      // console.log('D');
      this.buttonsStatus.DIRECTION_D = true;
    } else if (
      Math.abs(leftAxesHorizontal) < this.axesDeadzone &&
      leftAxesVertical < this.axesDeadzone * -1
    ) {
      // console.log('U');
      this.buttonsStatus.DIRECTION_U = true;
    } else if (
      leftAxesHorizontal >= this.axesDeadzone &&
      leftAxesVertical >= this.axesDeadzone
    ) {
      // console.log('RD');
      this.buttonsStatus.DIRECTION_RD = true;
    } else if (
      leftAxesHorizontal <= this.axesDeadzone * -1 &&
      leftAxesVertical >= this.axesDeadzone
    ) {
      // console.log('LD');
      this.buttonsStatus.DIRECTION_LD = true;
    } else if (
      leftAxesHorizontal >= this.axesDeadzone &&
      leftAxesVertical <= this.axesDeadzone * -1
    ) {
      // console.log('RU');
      this.buttonsStatus.DIRECTION_RU = true;
    } else if (
      leftAxesHorizontal <= this.axesDeadzone * -1 &&
      leftAxesVertical <= this.axesDeadzone * -1
    ) {
      // console.log('LU');
      this.buttonsStatus.DIRECTION_LU = true;
    }
  };

  /**
   * ゲームパッド接続処理
   *
   * @param {GamepadEvent} e
   * @memberof GamepadDevice
   */
  public connected = (e: GamepadEvent) => {
    this.connectedGamepadIndex = e.gamepad.index;
    this.doConnected?.(e.gamepad.id);
  };

  /**
   * ゲームパッド接続終了処理
   *
   * @memberof GamepadDevice
   */
  public disconnected = (e: GamepadEvent) => {
    this.connectedGamepadIndex = null;
    this.doDisconnected?.(e.gamepad.id);
  };
}
