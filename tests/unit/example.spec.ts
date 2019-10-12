import { shallowMount } from '@vue/test-utils';
import ButtonDropdown from '@/components/ButtonDropdown.vue';

describe('ExportButton.vue', () => {
  it('renders props.msg when passed', () => {
    const items = [{ text: 'Test', value: 'value' }];
    const wrapper = shallowMount(ButtonDropdown, {
      propsData: { items },
    });
    expect(wrapper.props().items).toBe(items);
  });
});
