import { MoneyUtils } from '../../../../src/app/shared/utils/MoneyUtils';
import { Money } from '../../../../src/app/shared/models/money';
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';
import Big from 'big.js';

_chai.should();
_chai.expect;

@suite class MoneyUtilsTest {
  private SUT: MoneyUtils;

  before() {
    this.SUT = new MoneyUtils();
  }

  @test centsRounding() {
    expect(MoneyUtils.format(100.5, 'E', 'EUR', false)).to.be.equal('E1.00');
    expect(MoneyUtils.format(101.5, 'E', 'EUR', false)).to.be.equal('E1.02');
    expect(MoneyUtils.format(101.4, 'E', 'EUR', false)).to.be.equal('E1.01');
    expect(MoneyUtils.format(-101.4, 'E', 'EUR', false)).to.be.equal('E-1.01');
  }

  @test groping() {
    expect(MoneyUtils.format(123456789, 'E', 'EUR', false)).to.be.equal('E1 234 567.89');
  }

  @test format() {
    let m : Money = {
      cashable: 1003,
      promo: 124
    };
    expect(MoneyUtils.getMoneyFormat('E', 'EUR').formatMoney(m)).to.be.equal('E10.03');
    expect(MoneyUtils.getMoneyFormat('E', 'EUR').formatMoney(m, true)).to.be.equal('E1.24');
    expect(MoneyUtils.getMoneyFormat('E', 'EUR').formatMoney(m, true, true)).to.be.equal('1.24');
  }

  @test toPoints() {
    expect(MoneyUtils.moneyToPoints(1028502, 0.035, 'E', 'EUR')).to.be.equal(293858);
    expect(MoneyUtils.pointsToMoney(293858, 0.035, 'E', 'EUR')).to.be.equal(1028503);
  }

  @test formatPoints() {
    expect(MoneyUtils.formatPoints(293858, 'E', 'EUR')).to.be.equal("Pts 293 858");
  }

}