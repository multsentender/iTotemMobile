import { StringUtils } from '../../../../src/app/shared/utils/StringUtils';
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';

_chai.should();
_chai.expect;

@suite class StringUtilsTest {
  private SUT: StringUtils;

  before() {
    this.SUT = new StringUtils();
  }

  @test padNumber() {
    expect(StringUtils.padNumber(5, 2)).to.be.equal('05');
    expect(StringUtils.padNumber(15, 2)).to.be.equal('15');
    expect(StringUtils.padNumber(-1, 1)).to.be.equal('-1');
    expect(StringUtils.padNumber(-2, 2)).to.be.equal('-02');
    expect(StringUtils.padNumber(0, 3)).to.be.equal('000');
    expect(function() {StringUtils.padNumber(0, 0); }).to.throw();

  }

  @test patternMatch() {
    expect(StringUtils.patternMatch("*", "43")).to.be.equal(true);
    expect(StringUtils.patternMatch("4*3", "43")).to.be.equal(true);
    expect(StringUtils.patternMatch("4*3", "487893")).to.be.equal(true);
    expect(StringUtils.patternMatch("5*3", "487893")).to.be.equal(false);
    expect(StringUtils.patternMatch("5*3", "554")).to.be.equal(false);
    expect(StringUtils.patternMatch("com.*", "com.test.34.dd")).to.be.equal(true);
    expect(StringUtils.patternMatch("com.*", "com")).to.be.equal(false);
    expect(StringUtils.patternMatch("Test.Logger.Logger4", "Test.Logger.Logger4")).to.be.equal(true);

  }

}