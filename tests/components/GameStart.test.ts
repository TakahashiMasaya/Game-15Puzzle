import { mount } from '@vue/test-utils';
import GameStart from '@/components/GameStart.vue';

describe('GameStart', () => {
  let clickCount = 0;
  const wrapper = mount(GameStart, {
    props: {
      start: () => {
        clickCount += 1;
      },
    },
  });
  it('snapshots', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('click test', async () => {
    await wrapper.find('button').trigger('click');
    expect(clickCount).toBe(1);
  });
});
