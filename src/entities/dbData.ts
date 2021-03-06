import {
  BoardFieldsEntity,
  CurrencyType,
  FieldGroupName,
  FieldType,
} from './board.fields.entity';
import { IInventoryItems, InventoryType } from 'src/types/game/game.types';

import { InventoryEntity } from './invenory.entity';
import { UsersEntity } from './users.entity';

// const calcRent = (price: number, stars: number) =>
//   Math.floor((price / 1000) * stars) * 10;

export const fieldsForSave = (): BoardFieldsEntity[] => {
  return [
    {
      fieldPosition: 0,
      imgSrc: 'fields/special/start.png',
      name: 'start',
      fieldCorner: 0,
      level: 0,
      type: FieldType.START,
    },
    {
      fieldPosition: 1,
      rent: {
        monopolyRent: 30,
        baseRent: 20,
        oneStar: 100,
        twoStar: 300,
        freeStar: 900,
        fourStar: 1600,
        bigStar: 2500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 600,
        pledgePrice: 300,
        buyoutPrice: 360,
        branchPrice: 500,
      },
      imgSrc: 'fields/brands/1_perfumery/chanel.svg',
      fieldGroup: 1,
      fieldLine: 0,
      name: 'chanel',
      level: 0,
      fieldGroupName: FieldGroupName.PARFUME,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 2,
      imgSrc: 'fields/special/tax_income.png',
      fieldLine: 0,
      name: 'tax_income',
      mnplSpecial: 1,
      level: 0,
      rent: {
        monopolyRent: 0,
        baseRent: 2000,
        oneStar: 0,
        twoStar: 0,
        freeStar: 0,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 0,
        pledgePrice: 0,
        buyoutPrice: 0,
        branchPrice: 0,
      },
      type: FieldType.TAX,
    },

    {
      fieldPosition: 3,
      rent: {
        monopolyRent: 60,
        baseRent: 40,
        oneStar: 200,
        twoStar: 200,
        freeStar: 1800,
        fourStar: 3200,
        bigStar: 4500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 600,
        pledgePrice: 300,
        buyoutPrice: 360,
        branchPrice: 500,
      },
      imgSrc: 'fields/brands/1_perfumery/hugo_boss.svg',
      fieldGroup: 1,
      fieldLine: 0,
      name: 'hugo_boss',
      level: 0,
      fieldGroupName: FieldGroupName.PARFUME,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 4,
      rent: {
        monopolyRent: 60,
        baseRent: 40,
        oneStar: 200,
        twoStar: 200,
        freeStar: 1800,
        fourStar: 3200,
        bigStar: 4500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 600,
        pledgePrice: 300,
        buyoutPrice: 360,
        branchPrice: 500,
      },
      imgSrc: 'fields/brands/1_perfumery/hugo_boss.svg',
      fieldGroup: 1,
      fieldLine: 0,
      name: 'iv_roche',
      level: 0,
      fieldGroupName: FieldGroupName.PARFUME,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 5,
      rent: {
        monopolyRent: 0,
        baseRent: 250,
        oneStar: 500,
        twoStar: 1000,
        freeStar: 2000,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2000,
        pledgePrice: 1000,
        buyoutPrice: 1200,
        branchPrice: 0,
      },
      imgSrc: 'fields/brands/0_auto/mercedes.svg',
      fieldGroup: 0,
      fieldLine: 0,
      name: 'mercedes',
      level: 0,
      fieldGroupName: FieldGroupName.AUTO,
      description:
        'Рента зависит от количества автомобилей, которыми Вы владеете',
      type: FieldType.AUTO,
    },
    {
      fieldPosition: 6,
      rent: {
        monopolyRent: 90,
        baseRent: 60,
        oneStar: 300,
        twoStar: 900,
        freeStar: 2700,
        fourStar: 4000,
        bigStar: 5500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1000,
        pledgePrice: 500,
        buyoutPrice: 600,
        branchPrice: 500,
      },
      imgSrc: 'fields/brands/2_clothing/adidas.svg',
      fieldGroup: 2,
      fieldLine: 0,
      name: 'adidas',
      level: 0,
      fieldGroupName: FieldGroupName.CLOTHES,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 7,
      imgSrc: 'fields/special/chance.png',
      fieldLine: 0,
      name: 'chance',
      mnplSpecial: 1,
      level: 0,
      type: FieldType.CHANCE,
    },
    {
      fieldPosition: 8,
      rent: {
        monopolyRent: 90,
        baseRent: 60,
        oneStar: 300,
        twoStar: 900,
        freeStar: 2700,
        fourStar: 4000,
        bigStar: 5500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1000,
        pledgePrice: 500,
        buyoutPrice: 600,
        branchPrice: 500,
      },
      imgSrc: 'fields/brands/2_clothing/puma.svg',
      fieldGroup: 2,
      fieldLine: 0,
      name: 'puma',
      level: 0,
      fieldGroupName: FieldGroupName.CLOTHES,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 9,
      rent: {
        monopolyRent: 120,
        baseRent: 80,
        oneStar: 400,
        twoStar: 1000,
        freeStar: 3000,
        fourStar: 4500,
        bigStar: 6000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1200,
        pledgePrice: 600,
        buyoutPrice: 720,
        branchPrice: 500,
      },
      imgSrc: 'fields/brands/2_clothing/lacoste.svg',
      fieldGroup: 2,
      fieldLine: 0,
      name: 'lacoste',
      level: 0,
      fieldGroupName: FieldGroupName.CLOTHES,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 10,
      fieldCorner: 1,
      imgSrc: '',
      isJail: true,
      name: 'jail',
      level: 0,
      type: FieldType.TAKE_REST,
    },
    {
      fieldPosition: 11,
      rent: {
        monopolyRent: 150,
        baseRent: 100,
        oneStar: 500,
        twoStar: 1500,
        freeStar: 4500,
        fourStar: 6250,
        bigStar: 7500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1400,
        pledgePrice: 700,
        buyoutPrice: 840,
        branchPrice: 750,
      },
      imgSrc: 'fields/brands/3_web/vk.svg',
      fieldGroup: 3,
      fieldLine: 1,
      name: 'vk',
      level: 0,
      fieldGroupName: FieldGroupName.WEB,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 12,
      rent: {
        monopolyRent: 0,
        baseRent: 100,
        oneStar: 250,
        twoStar: 0,
        freeStar: 0,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 1,
      },
      price: {
        startPrice: 1500,
        pledgePrice: 750,
        buyoutPrice: 900,
        branchPrice: 0,
      },
      imgSrc: 'fields/brands/9_games/rockstar_games.svg',
      fieldGroup: 9,
      fieldLine: 1,
      name: 'rockstar_games',
      level: 0,
      fieldGroupName: FieldGroupName.IT,
      description: 'Рента зависит от количества IT компаний',
      type: FieldType.IT,
      currency: CurrencyType.MULTIPLIER,
    },
    {
      fieldPosition: 13,
      rent: {
        monopolyRent: 150,
        baseRent: 100,
        oneStar: 500,
        twoStar: 1500,
        freeStar: 4500,
        fourStar: 6250,
        bigStar: 7500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1400,
        pledgePrice: 700,
        buyoutPrice: 840,
        branchPrice: 750,
      },
      imgSrc: 'fields/brands/3_web/facebook.svg',
      fieldGroup: 3,
      fieldLine: 1,
      name: 'facebook',
      level: 0,
      fieldGroupName: FieldGroupName.WEB,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 14,
      rent: {
        monopolyRent: 180,
        baseRent: 120,
        oneStar: 600,
        twoStar: 1800,
        freeStar: 5000,
        fourStar: 7000,
        bigStar: 8000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1600,
        pledgePrice: 800,
        buyoutPrice: 960,
        branchPrice: 750,
      },
      imgSrc: 'fields/brands/3_web/twitter.svg',
      fieldGroup: 3,
      fieldLine: 1,
      name: 'twitter',
      level: 0,
      fieldGroupName: FieldGroupName.WEB,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 15,
      rent: {
        monopolyRent: 0,
        baseRent: 250,
        oneStar: 500,
        twoStar: 1000,
        freeStar: 2000,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2000,
        pledgePrice: 1000,
        buyoutPrice: 1200,
        branchPrice: 0,
      },
      imgSrc: 'fields/brands/0_auto/audi.svg',
      fieldGroup: 0,
      fieldLine: 1,
      name: 'audi',
      fieldGroupName: FieldGroupName.AUTO,
      description:
        'Рента зависит от количества автомобилей, которыми Вы владеете',
      level: 0,
      type: FieldType.AUTO,
    },
    {
      fieldPosition: 16,
      rent: {
        monopolyRent: 210,
        baseRent: 140,
        oneStar: 700,
        twoStar: 2000,
        freeStar: 5600,
        fourStar: 7600,
        bigStar: 9700,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1800,
        pledgePrice: 900,
        buyoutPrice: 108,
        branchPrice: 1000,
      },
      imgSrc: 'fields/brands/4_drinks/coca_cola.svg',
      fieldGroup: 4,
      fieldLine: 1,
      name: 'coca_cola',
      level: 0,
      fieldGroupName: FieldGroupName.DRINKS,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 17,
      imgSrc: 'fields/special/chance.png',
      fieldLine: 1,
      name: 'chance',
      mnplSpecial: 1,
      level: 0,
      type: FieldType.CHANCE,
    },
    {
      fieldPosition: 18,
      rent: {
        monopolyRent: 210,
        baseRent: 140,
        oneStar: 700,
        twoStar: 2000,
        freeStar: 5600,
        fourStar: 7600,
        bigStar: 9700,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 1800,
        pledgePrice: 900,
        buyoutPrice: 1080,
        branchPrice: 1000,
      },
      imgSrc: 'fields/brands/4_drinks/pepsi.svg',
      fieldGroup: 4,
      fieldLine: 1,
      name: 'pepsi',
      level: 0,
      fieldGroupName: FieldGroupName.DRINKS,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 19,
      rent: {
        monopolyRent: 240,
        baseRent: 160,
        oneStar: 800,
        twoStar: 2200,
        freeStar: 6000,
        fourStar: 8000,
        bigStar: 10000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2000,
        pledgePrice: 1000,
        buyoutPrice: 1200,
        branchPrice: 1000,
      },
      imgSrc: 'fields/brands/4_drinks/fanta.svg',
      fieldGroup: 4,
      fieldLine: 1,
      name: 'fanta',
      level: 0,
      fieldGroupName: FieldGroupName.DRINKS,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 20,
      imgSrc: 'fields/special/jackpot.svg',
      fieldCorner: 2,
      mnplSpecial: 1,
      name: 'casino',
      level: 0,
      type: FieldType.CASINO,
    },
    {
      fieldPosition: 21,
      rent: {
        monopolyRent: 270,
        baseRent: 180,
        oneStar: 900,
        twoStar: 2500,
        freeStar: 7000,
        fourStar: 8750,
        bigStar: 10500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2200,
        pledgePrice: 1100,
        buyoutPrice: 1320,
        branchPrice: 1250,
      },
      imgSrc: 'fields/brands/5_airlines/american_airlines.svg',
      fieldLine: 2,
      fieldGroup: 5,
      name: 'american_airlines',
      level: 0,
      fieldGroupName: FieldGroupName.AVIA,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 22,
      imgSrc: 'fields/special/chance.png',
      mnplSpecial: 1,
      fieldLine: 2,
      name: 'chance',
      level: 0,
      type: FieldType.CHANCE,
    },
    {
      fieldPosition: 23,
      rent: {
        monopolyRent: 270,
        baseRent: 180,
        oneStar: 900,
        twoStar: 2500,
        freeStar: 7000,
        fourStar: 8750,
        bigStar: 10500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2200,
        pledgePrice: 1100,
        buyoutPrice: 1320,
        branchPrice: 1250,
      },
      imgSrc: 'fields/brands/5_airlines/lufthansa.svg',
      fieldGroup: 5,
      fieldLine: 2,
      name: 'lufthansa',
      level: 0,
      fieldGroupName: FieldGroupName.AVIA,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 24,
      rent: {
        monopolyRent: 300,
        baseRent: 200,
        oneStar: 1000,
        twoStar: 3000,
        freeStar: 7500,
        fourStar: 9250,
        bigStar: 11000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2400,
        pledgePrice: 1200,
        buyoutPrice: 1440,
        branchPrice: 1250,
      },
      imgSrc: 'fields/brands/5_airlines/british_airways.svg',
      fieldGroup: 5,
      fieldLine: 2,
      name: 'british_airways',
      level: 0,
      fieldGroupName: FieldGroupName.AVIA,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 25,
      rent: {
        monopolyRent: 0,
        baseRent: 250,
        oneStar: 500,
        twoStar: 1000,
        freeStar: 2000,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2000,
        pledgePrice: 1000,
        buyoutPrice: 1200,
        branchPrice: 0,
      },
      imgSrc: 'fields/brands/0_auto/ford.svg',
      fieldGroup: 0,
      fieldLine: 2,
      name: 'ford',
      level: 0,
      fieldGroupName: FieldGroupName.AUTO,
      description:
        'Рента зависит от количества автомобилей, которыми Вы владеете',
      type: FieldType.AUTO,
    },
    {
      fieldPosition: 26,
      rent: {
        monopolyRent: 330,
        baseRent: 220,
        oneStar: 1100,
        twoStar: 3300,
        freeStar: 8000,
        fourStar: 9750,
        bigStar: 11500,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2600,
        pledgePrice: 1300,
        buyoutPrice: 1560,
        branchPrice: 1500,
      },
      imgSrc: 'fields/brands/6_food/mcdonalds.svg',
      fieldGroup: 6,
      fieldLine: 2,
      name: 'mcdonalds',
      level: 0,
      fieldGroupName: FieldGroupName.RESTARAUNT,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 27,
      rent: {
        monopolyRent: 360,
        baseRent: 240,
        oneStar: 1200,
        twoStar: 3600,
        freeStar: 8500,
        fourStar: 10250,
        bigStar: 12000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2800,
        pledgePrice: 1400,
        buyoutPrice: 1680,
        branchPrice: 1500,
      },
      imgSrc: 'fields/brands/6_food/burger_king.svg',
      fieldGroup: 6,
      fieldLine: 2,
      name: 'burger_king',
      level: 0,
      fieldGroupName: FieldGroupName.RESTARAUNT,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 28,
      rent: {
        monopolyRent: 0,
        baseRent: 100,
        oneStar: 250,
        twoStar: 0,
        freeStar: 0,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 1,
      },
      price: {
        startPrice: 1500,
        pledgePrice: 750,
        buyoutPrice: 900,
        branchPrice: 0,
      },
      imgSrc: 'fields/brands/9_games/rovio.svg',
      fieldGroup: 9,
      fieldLine: 2,
      name: 'rovio',
      level: 0,
      fieldGroupName: FieldGroupName.IT,
      description: 'Рента зависит от количества IT компаний',
      type: FieldType.IT,
      currency: CurrencyType.MULTIPLIER,
    },
    {
      fieldPosition: 29,
      rent: {
        monopolyRent: 360,
        baseRent: 240,
        oneStar: 1200,
        twoStar: 3600,
        freeStar: 8500,
        fourStar: 10250,
        bigStar: 1200,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2800,
        pledgePrice: 1400,
        buyoutPrice: 1680,
        branchPrice: 1500,
      },
      imgSrc: 'fields/brands/6_food/kfc.svg',
      fieldGroup: 6,
      fieldLine: 2,
      name: 'kfc',
      level: 0,
      fieldGroupName: FieldGroupName.RESTARAUNT,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 30,
      imgSrc: 'fields/special/goToJail.png',
      mnplSpecial: 1,
      fieldCorner: 3,
      name: 'arest',
      level: 0,
      type: FieldType.JAIL,
    },
    {
      fieldPosition: 31,
      rent: {
        monopolyRent: 390,
        baseRent: 260,
        oneStar: 1300,
        twoStar: 3600,
        freeStar: 9000,
        fourStar: 11000,
        bigStar: 12750,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 3000,
        pledgePrice: 1500,
        buyoutPrice: 1800,
        branchPrice: 1750,
      },
      imgSrc: 'fields/brands/7_hotels/holiday_inn.svg',
      fieldGroup: 7,
      fieldLine: 3,
      name: 'holiday_inn',
      level: 0,
      fieldGroupName: FieldGroupName.HOTEL,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 32,
      rent: {
        monopolyRent: 390,
        baseRent: 260,
        oneStar: 1300,
        twoStar: 3900,
        freeStar: 9000,
        fourStar: 11000,
        bigStar: 12750,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 3000,
        pledgePrice: 1500,
        buyoutPrice: 1800,
        branchPrice: 1750,
      },
      imgSrc: 'fields/brands/7_hotels/radisson_blu.svg',
      fieldGroup: 7,
      fieldLine: 3,
      name: 'radisson_blu',
      level: 0,
      fieldGroupName: FieldGroupName.HOTEL,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 33,
      imgSrc: 'fields/special/chance_rotated.png',
      mnplSpecial: 1,
      fieldLine: 3,
      name: 'chance_rotated',
      level: 0,
      type: FieldType.CHANCE,
    },
    {
      fieldPosition: 34,
      rent: {
        monopolyRent: 420,
        baseRent: 280,
        oneStar: 1500,
        twoStar: 4500,
        freeStar: 10000,
        fourStar: 12000,
        bigStar: 14000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 3200,
        pledgePrice: 1600,
        buyoutPrice: 1920,
        branchPrice: 1750,
      },
      imgSrc: 'fields/brands/7_hotels/novotel.svg',
      fieldGroup: 7,
      fieldLine: 3,
      name: 'novotel',
      level: 0,
      fieldGroupName: FieldGroupName.HOTEL,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 35,
      rent: {
        monopolyRent: 0,
        baseRent: 250,
        oneStar: 500,
        twoStar: 1000,
        freeStar: 2000,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 2000,
        pledgePrice: 1000,
        buyoutPrice: 1200,
        branchPrice: 0,
      },
      imgSrc: 'fields/brands/0_auto/land_rover.svg',
      fieldGroup: 0,
      fieldLine: 3,
      name: 'land_rover',
      level: 0,
      fieldGroupName: FieldGroupName.AUTO,
      description:
        'Рента зависит от количества автомобилей, которыми Вы владеете',
      type: FieldType.AUTO,
    },
    {
      fieldPosition: 36,
      imgSrc: 'fields/special/tax_luxury.png',
      mnplSpecial: 1,
      fieldLine: 3,
      name: 'tax_luxury',
      level: 0,
      rent: {
        monopolyRent: 0,
        baseRent: 1000,
        oneStar: 0,
        twoStar: 0,
        freeStar: 0,
        fourStar: 0,
        bigStar: 0,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 0,
        pledgePrice: 0,
        buyoutPrice: 0,
        branchPrice: 0,
      },
      type: FieldType.TAX,
    },
    {
      fieldPosition: 37,
      imgSrc: 'fields/brands/8_smartphones/apple.svg',
      fieldLine: 3,
      fieldGroup: 8,
      rent: {
        monopolyRent: 500,
        baseRent: 350,
        oneStar: 1750,
        twoStar: 5000,
        freeStar: 11000,
        fourStar: 13000,
        bigStar: 15000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 3500,
        pledgePrice: 1750,
        buyoutPrice: 2100,
        branchPrice: 2000,
      },
      name: 'apple',
      level: 0,
      fieldGroupName: FieldGroupName.ELECTRONIC,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
    {
      fieldPosition: 38,
      imgSrc: 'fields/special/chance_rotated.png',
      mnplSpecial: 1,
      fieldLine: 3,
      name: 'chance_rotated',
      level: 0,
      type: FieldType.CHANCE,
    },
    {
      fieldPosition: 39,
      imgSrc: 'fields/brands/8_smartphones/nokia.svg',
      fieldLine: 3,
      fieldGroup: 8,
      rent: {
        monopolyRent: 1000,
        baseRent: 500,
        oneStar: 2000,
        twoStar: 6000,
        freeStar: 14000,
        fourStar: 17000,
        bigStar: 20000,
        paymentMultiplier: 0,
      },
      price: {
        startPrice: 4000,
        pledgePrice: 2000,
        buyoutPrice: 2400,
        branchPrice: 2000,
      },
      name: 'nokia',
      level: 0,
      fieldGroupName: FieldGroupName.ELECTRONIC,
      description: 'Стройте филиалы, чтобы увеличить ренту',
      type: FieldType.COMPANY,
    },
  ];
};

const createInventory = (): IInventoryItems[] => {
  return [
    {
      date: new Date(),
      gameId: 'qqq1',
      inventoryId: 1,
      inventoryType: InventoryType.CARDS,
      quantity: 1,
    },
    {
      date: new Date(),
      gameId: 'qqq2',
      inventoryId: 2,
      inventoryType: InventoryType.CARDS,
      quantity: 1,
    },
    {
      date: new Date(),
      gameId: 'qqq3',
      inventoryId: 3,
      inventoryType: InventoryType.CARDS,
      quantity: 1,
    },
    {
      date: new Date(),
      gameId: 'qqq4',
      inventoryId: 4,
      inventoryType: InventoryType.CARDS,
      quantity: 1,
    },
  ];
};
export const users: UsersEntity[] = [
  {
    name: 'TestUser',
    isTestUser: true,
    password: 'password',
    email: 'TestUser1@yandex.ru',
    registrationType: 'vk',
    vip: true,
    registrationCode: 'sdfvsef',
    avatar: '/avatars/konstanstin.png',
    inventory: [],
  },
];

export const inventoryData = (): InventoryEntity[] => [
  {
    created: new Date(),
    imgSrc: 'https://cdn1.ozone.ru/s3/multimedia-a/wc1200/6005900230.jpg',
    name: 'Кубики',
    type: InventoryType.DICES,
  },
  // {
  //   date: new Date(),
  //   gameId: 'qqq1',
  //   inventoryId: 1,
  //   inventoryType: InventoryType.CARDS,
  //   quantity: 1,
  // },
];
