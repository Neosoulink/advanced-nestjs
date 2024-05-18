import { WithUuidMixin } from '../../common/mixin/with-uuid.mixin/with-uuid.mixin';

export class Coffee {
  constructor(public name: string) {}
}

const CoffeeWithUuidCls = WithUuidMixin(Coffee);
const coffee = new CoffeeWithUuidCls('Name');

console.log(coffee.uuid, coffee.regenerateUuid(), coffee.uuid);
