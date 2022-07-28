import { AgentRateUtils } from '../../../../src/app/shared/utils/AgentRateUtils';
import { GameGroup } from '../../../../src/app/shared/models/gameGroup';
import { AgentRateInfo } from '../../../../src/app/shared/models/agentRateInfo';
import { RateInfo } from '../../../../src/app/shared/models/rateInfo';
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';
import Big from 'big.js';

_chai.should();
_chai.expect;

@suite class AgentRateUtilsTest {
  private agentRateInfo: AgentRateInfo;
  private agentInfoJson: string = '{"_c":"AgentInfo","prefix":"a","id":768,"label":"AgentName","permissions":["AGENT_VIEW_REPORT_BY_SERVICE","AGENT_ACL_EDIT","AGENT_VIEW_REPORT_BY_TREND","KIOSK_VIEW","AGENT_CANCEL_TRANSACTION","ROOM_VIEW","AGENT_CREATE_SUB_AGENT","TOURNAMENT_EDIT","KIOSK_CREATE_RECHARGER","AGENT_EDIT_IDPOS","VIEW_SUPPORT_BUTTON","AGENT_VIEW_LOBBY_SETTINGS","JACKPOT_VIEW_HISTORY_REPORT","ROOM_PANIC_BUTTON","AGENT_TRANSFER_MONEY_TO_SERVICE","GAMES_VIEW","TOURNAMENT_VIEW","KIOSK_CREATE_PHONE","JACKPOT_VIEW","EDIT_LOGIN_DATA","AGENT_VIEW_ADVERTISEMENT","AGENT_VIEW","AGENT_TRANSFER_MONEY_NEGOTIVE","KIOSK_CREATE_PC","AGENT_DELETE","AGENT_TRANSFER_MONEY","KIOSK_VIEW_TRANSACTIONS","KIOSK_MOVE","ROOM_EDIT","AGENT_CREATE_SUB_AGENT_INTEGRATION","CASINO_VIEW","KIOSK_KILL_ACTIVE_SESSIONS","AGENT_VIEW_OVERDRAFT","KIOSK_CREATE_CARD","TOURNAMENT_VIEW_HISTORY_REPORT","AGENT_VIEW_ANALITICS","ROOM_DELETE","AGENT_VIEW_DEALER_SHARE","AGENT_VIEW_REPORT_BY_KIOSK","KIOSK_EDIT","AGENT_VIEW_EXTRA_FIELDS","AGENT_CREATE_JACKPOT","TOURNAMENT_DELETE","ROLE_MANAGEMENT","AGENT_VIEW_REPORT_BY_PROVIDER","KIOSK_DOWNLOAD_CERT_PFX","AGENT_CREATE_ROOM","AGENT_CHANGE_OVERDRAFT","AGENT_EXCLUDE_GROUP_RATES","AGENT_EDIT","AGENT_ACL_VIEW_IP_ADDRESSES","AGENT_VIEW_KIOSKS_MAP","AGENT_INTEGRATION_DOWNLOAD_CERT_PFX","AGENT_WITHDRAW_DEALER_SHARE","AGENT_ACL_VIEW","AGENT_CREATE_TOURNAMENT","AGENT_EDIT_GROUP_RATES","ROOM_ACL_VIEW","AGENT_INTEGRATION_DOWNLOAD_CERT","ROOM_ACL_EDIT","JACKPOT_DELETE","KIOSK_CREATE_KIOSK","AGENT_REDEEM_VOUCHER","EVENT_LOG_VIEW","ROOM_ACL_VIEW_IP_ADDRESSES","KIOSK_CASHIER","KIOSK_DELETE","AGENT_VIEW_REPORT_FOR_ANY_DATE","AGENT_EDIT_ADVERTISEMENT","AGENT_VIEW_SERVICE_BALANCE","AGENT_CHANGE_LOBBY_SETTINGS","VOUCHER_MANAGEMENT","AGENT_EDIT_EXTRA_FIELDS","AGENT_BLOCK_PROVIDER","CASINO_EDIT","AGENT_TRANSFER_MONEY_DETAILS","ROOM_VIEW_PANEL","KIOSK_CASHIER_RECHARGER","AGENT_VIEW_RATES_TREE","AGENT_INTEGRATION_VIEW_CERT_SN","ROOM_VIEW_TELEGRAM_QR_CODE","VIEW_TECHSUPPORT_CHAT","AGENT_VIEW_BALANCE","JACKPOT_EDIT","AGENT_BLOCK"],"currencyCode":"EUR","currency":"€","deleted":false,"children":[],"rate":0.035,"walletNumber":"EUR9300258069","blocked":false,"dealer":false,"balance":1028501.9269999998,"overdraft":0,"agentRateInfo":{"agentId":0,"rateInfo":{"id":0,"minRate":0.0,"maxRate":0.06,"rate":0.035,"gameGroupId":0,"excluded":false},"gameGroups":{"64":{"groupId":64,"groupName":"Slots.Wazdan","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false},"1":{"groupId":1,"groupName":"Live","revenueExclude":false,"colorIndex":3,"blocked":true,"parentId":0,"service":false},"65":{"groupId":65,"groupName":"Hot","revenueExclude":false,"colorIndex":1,"blocked":true,"parentId":0,"service":false},"66":{"groupId":66,"groupName":"Bonuses","revenueExclude":false,"colorIndex":0,"blocked":false,"parentId":0,"service":false},"3":{"groupId":3,"groupName":"Slots","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":0,"service":false},"67":{"groupId":67,"groupName":"Slots.Mascot","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false},"68":{"groupId":68,"groupName":"Slots.Timeless","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false},"69":{"groupId":69,"groupName":"Slots.LuckySpins","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false},"70":{"groupId":70,"groupName":"Slots.Kajot","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false},"76":{"groupId":76,"groupName":"Sport","revenueExclude":false,"colorIndex":0,"blocked":false,"parentId":0,"service":false},"78":{"groupId":78,"groupName":"gameBanner","revenueExclude":false,"colorIndex":0,"blocked":false,"parentId":0,"service":false},"39":{"groupId":39,"groupName":"Internet","revenueExclude":false,"colorIndex":0,"blocked":true,"parentId":0,"service":false},"47":{"groupId":47,"groupName":"Tournaments","revenueExclude":false,"colorIndex":4,"blocked":true,"parentId":0,"service":false},"51":{"groupId":51,"groupName":"Slots.BCW","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false,"costRate":0.04,"minSaleRate":0.08},"52":{"groupId":52,"groupName":"Slots.CGM","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false,"costRate":0.0,"minSaleRate":0.05},"53":{"groupId":53,"groupName":"Slots.Genesis","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false,"costRate":0.02,"minSaleRate":0.06},"54":{"groupId":54,"groupName":"Slots.OCB","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false},"55":{"groupId":55,"groupName":"Slots.XWin","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false},"56":{"groupId":56,"groupName":"Live.MLC","revenueExclude":false,"colorIndex":3,"blocked":true,"parentId":1,"service":false},"57":{"groupId":57,"groupName":"Live.Ezugi","revenueExclude":false,"colorIndex":3,"blocked":true,"parentId":1,"service":false},"58":{"groupId":58,"groupName":"Live.PornHub","revenueExclude":false,"colorIndex":3,"blocked":true,"parentId":1,"service":false},"59":{"groupId":59,"groupName":"Live.Tombala","revenueExclude":false,"colorIndex":3,"blocked":true,"parentId":1,"service":false},"60":{"groupId":60,"groupName":"Live.VIVO","revenueExclude":false,"colorIndex":3,"blocked":true,"parentId":1,"service":false},"61":{"groupId":61,"groupName":"Live.VirtualGames","revenueExclude":false,"colorIndex":3,"blocked":true,"parentId":1,"service":false},"62":{"groupId":62,"groupName":"Jackpots","revenueExclude":false,"colorIndex":4,"blocked":false,"parentId":0,"service":false},"63":{"groupId":63,"groupName":"Slots.Apollo","revenueExclude":false,"colorIndex":2,"blocked":true,"parentId":3,"service":false}},"groupRateInfo":{"64":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":64,"excluded":false},"1":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":1,"excluded":false},"65":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":65,"excluded":false},"66":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":66,"excluded":false},"3":{"id":117,"minRate":0.0,"maxRate":0.06,"rate":0.02,"gameGroupId":3,"excluded":false},"67":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":67,"excluded":false},"68":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":68,"excluded":false},"69":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":69,"excluded":false},"70":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":70,"excluded":false},"76":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":76,"excluded":false},"78":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":78,"excluded":false},"39":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":39,"excluded":false},"47":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":47,"excluded":false},"51":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":51,"excluded":false},"52":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":52,"excluded":false},"53":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":53,"excluded":false},"54":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":54,"excluded":false},"55":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":55,"excluded":false},"56":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":56,"excluded":false},"57":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":57,"excluded":false},"58":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":58,"excluded":false},"59":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":59,"excluded":false},"60":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":60,"excluded":false},"61":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":61,"excluded":false},"62":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":62,"excluded":false},"63":{"id":0,"minRate":0.0,"maxRate":0.06,"gameGroupId":63,"excluded":false}},"group2providers":{"1":["Timeless","GameEmulator","Vitory"],"65":["GGA","Nucleus","BetZoneLab"],"66":["Bonuses"],"3":["TomHorn","SoftSwiss","Timeless","Endorphina","Spinomenal","Betsoft","GameEmulator","Appolo","CGModule","Platipus"],"67":["OutcomeBet3"],"68":["Timeless"],"69":["LuckySpins"],"70":["Kajot"],"39":["Internet"],"40":["EWallet"],"72":["SoftSwiss","GameEmulator"],"73":["SoftSwiss"],"74":["Kajot"],"44":["ZipBuy"],"76":["Sport"],"47":["Tournament"],"80":["GameEmulator"],"52":["GameEmulator","CGModule"],"54":["OutcomeBet3"],"56":["MediaLiveCasino","GameEmulator"],"60":["Vivo"],"62":["Jackpot"],"63":["GameEmulator"]},"providerConfigs":{"Egss":[{"agentId":1,"providerName":"Egss","blocked":0,"depth":-2}],"Tombala":[{"agentId":1,"providerName":"Tombala","blocked":0,"depth":-2},{"agentId":975,"providerName":"Tombala","providerConfigId":58,"depth":-1}],"Oryx":[{"agentId":1,"providerName":"Oryx","providerConfigId":48,"blocked":0,"depth":-2}],"Unikilobyte":[{"agentId":1,"providerName":"Unikilobyte","blocked":0,"depth":-2}],"DBG":[{"agentId":1,"providerName":"DBG","blocked":0,"depth":-2}],"CGModule":[{"agentId":1,"providerName":"CGModule","providerConfigId":1,"blocked":0,"depth":-2},{"agentId":768,"providerName":"CGModule","blocked":0,"depth":0}],"Triumph":[{"agentId":1,"providerName":"Triumph","blocked":0,"depth":-2}],"ZipBuy":[{"agentId":1,"providerName":"ZipBuy","providerConfigId":36,"blocked":0,"depth":-2},{"agentId":1178,"providerName":"ZipBuy","providerConfigId":126,"depth":1}],"Borut2Live":[{"agentId":1,"providerName":"Borut2Live","blocked":0,"depth":-2}],"XWin":[{"agentId":1,"providerName":"XWin","blocked":0,"depth":-2}],"GoldenRace_MCM":[{"agentId":1,"providerName":"GoldenRace_MCM","providerConfigId":10,"depth":-2}],"EWallet":[{"agentId":1,"providerName":"EWallet","blocked":0,"depth":-2},{"agentId":975,"providerName":"EWallet","providerConfigId":44,"depth":-1}],"Timeless":[{"agentId":975,"providerName":"Timeless","providerConfigId":112,"depth":-1}],"PornhubCasino":[{"agentId":1,"providerName":"PornhubCasino","blocked":0,"depth":-2}],"CGModuleClassic":[{"agentId":1,"providerName":"CGModuleClassic","providerConfigId":2,"depth":-2}],"Bet90":[{"agentId":975,"providerName":"Bet90","providerConfigId":98,"depth":-1},{"agentId":768,"providerName":"Bet90","blocked":1,"depth":0}],"Borut2":[{"agentId":1,"providerName":"Borut2","blocked":0,"depth":-2}],"Vivo":[{"agentId":1,"providerName":"Vivo","blocked":0,"depth":-2}],"Endorphina":[{"agentId":1,"providerName":"Endorphina","blocked":0,"depth":-2},{"agentId":975,"providerName":"Endorphina","blocked":0,"depth":-1}],"Ezugi":[{"agentId":1,"providerName":"Ezugi","providerConfigId":8,"depth":-2}],"OutcomeBet3":[{"agentId":975,"providerName":"OutcomeBet3","providerConfigId":103,"depth":-1},{"agentId":768,"providerName":"OutcomeBet3","providerConfigId":103,"blocked":1,"depth":0}],"CodePinCard":[{"agentId":1,"providerName":"CodePinCard","providerConfigId":3,"blocked":1,"depth":-2}],"DBGSpecial":[{"agentId":1,"providerName":"DBGSpecial","blocked":0,"depth":-2}],"TreCasino":[{"agentId":1,"providerName":"TreCasino","providerConfigId":34,"blocked":1,"depth":-2}],"OutcomeBet2":[{"agentId":1,"providerName":"OutcomeBet2","blocked":0,"depth":-2},{"agentId":768,"providerName":"OutcomeBet2","blocked":1,"depth":0}],"VLTGroup":[{"agentId":1,"providerName":"VLTGroup","blocked":0,"depth":-2}],"MediaLiveCasino":[{"agentId":1,"providerName":"MediaLiveCasino","blocked":0,"depth":-2},{"agentId":768,"providerName":"MediaLiveCasino","blocked":1,"depth":0}],"GammaBet_arc":[{"agentId":1,"providerName":"GammaBet_arc","providerConfigId":9,"depth":-2}],"GameEmulator":[{"agentId":975,"providerName":"GameEmulator","providerConfigId":118,"depth":-1}],"Genesis":[{"agentId":1,"providerName":"Genesis","providerConfigId":55,"blocked":1,"depth":-2}],"Internet":[{"agentId":1,"providerName":"Internet","providerConfigId":11,"depth":-2},{"agentId":975,"providerName":"Internet","providerConfigId":101,"depth":-1},{"agentId":768,"providerName":"Internet","providerConfigId":12,"depth":0}]},"canEdit":true,"agentLevel":3},"lastPaid":1627980226000,"collectFromSubAgents":0.0,"language":"it-IT","excludeFromTournaments":false,"excludeFromJackpots":false,"parentAgentId":975,"cashierAmounts":[500,1000,2000,5000,10000,20000,50000],"canViewStructure":true,"extraFields":{}}';

  private liveGroupId : number = 1;
  private slotsGroupId : number = 3;
  private slotsApolloGroupId : number = 63;
  private liveVivoGroupId : number = 60;
  private rootGroupRate : number = 0.035;
  private slotsGroupRate : number = 0.02;

  before() {
    let agentInfo = JSON.parse(this.agentInfoJson);
    this.agentRateInfo = agentInfo.agentRateInfo;
  }

   @test getEffectiveRates() {
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.rateInfo)).to.be.equal(this.rootGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId])).to.be.equal(this.rootGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId])).to.be.equal(this.rootGroupRate);
   }

   @test getEffectiveMinRate() {
    expect(AgentRateUtils.getEffectiveMinRate(this.agentRateInfo, this.agentRateInfo.rateInfo)).to.be.equal(0);
    expect(AgentRateUtils.getEffectiveMinRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId])).to.be.equal(0);
    expect(AgentRateUtils.getEffectiveMinRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId])).to.be.equal(0);
    expect(AgentRateUtils.getEffectiveMinRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId])).to.be.equal(0);
    expect(AgentRateUtils.getEffectiveMinRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId])).to.be.equal(0);
   }

   @test getEffectiveMaxRate() {
    expect(AgentRateUtils.getEffectiveMaxRate(this.agentRateInfo, this.agentRateInfo.rateInfo)).to.be.equal(0.06);
    expect(AgentRateUtils.getEffectiveMaxRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId])).to.be.equal(0.06);
    expect(AgentRateUtils.getEffectiveMaxRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId])).to.be.equal(0.06);
    expect(AgentRateUtils.getEffectiveMaxRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId])).to.be.equal(0.06);
    expect(AgentRateUtils.getEffectiveMaxRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId])).to.be.equal(0.06);
   }

   @test validateRate() {
    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.rateInfo, 0.06)).to.be.eq(undefined);
    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.rateInfo, 0.061)).to.contains("6.0");

    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId], 0.06)).to.be.eq(undefined);
    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId], 0.061)).to.contains("6.0");

    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId], 0.06)).to.be.eq(undefined);
    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId], 0.061)).to.contains("6.0");

    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId], 0.06)).to.be.eq(undefined);
    expect(AgentRateUtils.validateRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId], 0.061)).to.contains("6.0");

   }

   @test checkRateForDefault() {

    let rateInfo : RateInfo = this.agentRateInfo.rateInfo;
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveVivoGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
   }

   @test setEffectiveRateRoot() {
    let rate = 0.05;
    AgentRateUtils.setEffectiveRate(this.agentRateInfo, this.agentRateInfo.rateInfo, rate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.rateInfo)).to.be.equal(rate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId])).to.be.equal(rate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId])).to.be.equal(rate);

    let rateInfo : RateInfo = this.agentRateInfo.rateInfo;
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveVivoGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);

   }

   @test setEffectiveRateLive() {
    let rate = 0.05;
    AgentRateUtils.setEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId], rate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.rateInfo)).to.be.equal(this.rootGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId])).to.be.equal(rate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId])).to.be.equal(rate);

    let rateInfo : RateInfo = this.agentRateInfo.rateInfo;
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveVivoGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);

   }

   @test setEffectiveRateLiveVivo() {
    let rate = 0.05;
    AgentRateUtils.setEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId], rate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.rateInfo)).to.be.equal(this.rootGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveGroupId])).to.be.equal(this.rootGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId])).to.be.equal(this.slotsGroupRate);
    expect(AgentRateUtils.getEffectiveRate(this.agentRateInfo, this.agentRateInfo.groupRateInfo[this.liveVivoGroupId])).to.be.equal(rate);

    let rateInfo : RateInfo = this.agentRateInfo.rateInfo;
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);
    rateInfo = this.agentRateInfo.groupRateInfo[this.slotsApolloGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(true);
    rateInfo = this.agentRateInfo.groupRateInfo[this.liveVivoGroupId];
    expect(AgentRateUtils.checkRateForDefault(this.agentRateInfo, rateInfo, 
        AgentRateUtils.getEffectiveRate(this.agentRateInfo, rateInfo))).to.be.equal(false);

   }

}