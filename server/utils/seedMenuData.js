const mongoose = require('mongoose');
const Meal = require('../models/Meal');
const connectDB = require('./mongodb');

const menuData = {
  'Hall-1': {
    daily: {
      breakfast: {
        regular: ['Sprouts (boiled chana+ moong), sprouts masala chaat, Tea, Zeera/ 2 Banana/ Full Milk with Bournvita/Horlicks/ Coffee)', '1Egg/1 banana with Half Milk , (Chocos/Cornflakes), Bread, Butter, Jam/peanut butter(1 spoon)'],
        extras: ['Mix Vegetable Juice']
      },
      lunch: {
        regular: ['Chapati (Plain, Buttered), Pickle, Plain Rice, Salad, Lemon, Rasam'],
        extras: ['Omelette, Full Fry, Half Fry, Egg Fried Rice, Bread-Omelette, Paneer paratha, Aloo fry, Veg Fried Rice, Paneer Fried Rice, Egg curry, Paneer bhujiya, Egg bhujiya, Veg Raita, Aloo bhaja, Chilli Paneer, Mix Vegetable Juice']
      },
      dinner: {
        regular: ['Chapati (Plain, Buttered), Pickle, Plain Rice, Salad, Gur'],
        extras: ['Omelette, Full Fry, Half Fry, Egg Fried Rice, Bread-Omelette, Aloo Fry, Veg Fried Rice, Paneer Fried Rice, Egg curry, Paneer bhujiya, Egg bhujiya, Veg Raita, Aloo bhaja, Chilly Paneer, Mix Vegetable Juice']
      }
    },
    monday: {
      breakfast: {
        regular: ['Masala Idli (9,23) / Fried idli (16,30), Vada (max 3), Idli, Sambar, Nariyal chutney, Tomato chutney']
      },
      lunch: {
        regular: ['Lauki Chana dal, Aloo Shimla/Besan Gatte,Nimbu Shikanji'],
        extras: ['Samosa Chat, Chilli Chicken Dry']
      },
      dinner: {
        regular: ['Ghugni, Arbi, Mix dal, Puri'],
        extras: ['Honey Chilli Potato, Mutton Biryani with Salad']
      }
    },
    tuesday: {
      breakfast: {
        regular: ['Upma(8,22)/Vermicelli (15,29), Hari , Nariyal Chutney']
      },
      lunch: {
        regular: ['Aloo Soyabean, Bhindi, Masoor Dal, Tehri, Cucumber Pickle, Papad, Curd/Curd rice,Roohafza'],
        extras: ['Fish Curry']
      },
      dinner: {
        regular: ['Pindi Chola,Kulcha (8,22): Chola bhatura (15,29), Chana daal'],
        extras: ['Egg biryani, Paan puri']
      }
    },
    wednesday: {
      breakfast: {
        regular: ['(9,23) Besan/Moong Dal Chilla,Green Chutney, Tomato Sauce', '(16,30) Sabudana Khichadi']
      },
      lunch: {
        regular: ['Kaddu jeera, Arhar Dal, Curd rice/Curd, Buttermilk'],
        extras: ['Masala Pav, Chicken Korma'],
        special: ['J Malai Kofta (11, 25), Kadhai Paneer (18,02) Navrattan dal, Green peas Pulao, Garlic Naan/ Missi roti, Ice cream, Chicken Curry / Butter Chicken']
      },
      dinner: {
        regular: ['Mix Veg Sabzi/Lubiya, Red Masoor Dal'],
        extras: ['Chowmein, Chicken lollipop']
      }
    },
    thursday: {
      breakfast: {
        regular: ['Uttapam, Sambar, Nariyal Chutney, Tomato chutney']
      },
      lunch: {
        regular: ['Kadhi Pakoda,, Aloo Jeera, Black Masoor Dal(Chilka), Curd/Curd rice, Rasna'],
        extras: ['Shaktu']
      },
      dinner: {
        regular: ['Mix Veg Sabzi/Lubiya, Red Masoor Dal'],
        extras: ['Chowmein, Chicken lollipop']
      }
    },
    friday: {
      breakfast: {
        regular: ['Aloo/Vegetable Sandwich (18,1) / Pav Bhaji (11,25)']
      },
      lunch: {
        regular: ['Kundru/ Bharva Karela, Kachori, Nimbu Pani, Curd/Curd rice'],
        extras: ['Fish Tikka']
      },
      dinner: {
        regular: ['Bhindi/Aloo Bhindi, Arahar Dal, Tamarind rice, Fruit Raita(4,18),Sewai Kheer(11,24)'],
        extras: ['Paneer Tikka, Chees Roast Chicken']
      }
    },
    saturday: {
      breakfast: {
        regular: ['Dosa(plain/masala/onion), Sambar, Nariyal chutney, Tomato chutney, Tomato sauce, Poha, Sabudana Vada, Bhujiya Sev, Jalebi, Dahi']
      },
      lunch: {
        regular: ['Aloo/Onion/Mix Paratha/Paneer Paratha (1piece), green chutney, Chana, Buttermilk,Curd/Curd rice'],
        extras: ['Corn Crush']
      },
      dinner: {
        regular: ['Jajor, Dalma, Jeera Rice, Sooji Halwa'],
        extras: ['Paneer Roll, Chicken Biryani'],
        special: ['Matar Paneer, Jeera Rice, Mughlai dal, Tandoori roti, Rasgulla,Egg Fried Rice/Aloo Pyaz Pakode, salad Malai Methi Chicken, Chicken Kassa']
      }
    },
    sunday: {
      breakfast: {
        regular: ['(2eggs/2 banana+200 ml milk) Or 4 banana Or 4 eggs Or (300 ml milk+1 banana/ 1 egg)']
      },
      lunch: {
        regular: ['Veg Pulao, Mix veg moong Dal, Aloo Lobia Curd/Curd rice, lassi'],
        extras: ['Lithi Chokha , Fish Fingers']
      },
      dinner: {
        regular: ['(2banana+200 ml milk) Or (3 banana+100 ml milk) Or (1 banana+ 200ml Bournvita milk) Or 300ml milk Or (2 Boiled eggs+200 ml milk) (3banana+300 ml milk) Or (4 banana+200 ml milk) Or 300 ml Bournvita milk Or 400 ml milk Or 3 boiled eggs+200 ml milk']
      }
    }
  },
  'Hall-3': {
    daily: {
      breakfast: {
        regular: ['BREAD, BUTTER/PEANUT BUTTER, JAM, SPROUTS, TEA', 'MILK BOURNVITA / 2 BOILED EGG, CORNFLAKES']
      },
      lunch: {
        regular: ['ROTI (PLAIN & BUTTER) RICE', 'CURD, DAL/VEG,SALAD,SAMBHAR']
      },
      dinner: {
        regular: ['ROTI (PLAIN & BUTTER) RICE', 'MIX PICKLE,SALAD,CHEV']
      }
    },
    monday: {
      breakfast: {
        regular: ['ALOO SANDWICH WITH CHUTNEY']
      },
      lunch: {
        regular: ['CHANA DAL, BHINDI KOBOUNI, BOONDI RAITA'],
        extras: ['CRISPY CORN, DOOGH BARFI, CHICKEN LOLLIPOP, PANEER KORMA']
      },
      dinner: {
        regular: ['MIX DAL, MATAR MASIANA'],
        extras: ['PANEER DO PYAZA, PAPDI CHAT, BUTTER CHICKEN, PAROTHA']
      }
    },
    tuesday: {
      breakfast: {
        regular: ['PLAIN /ALOO PYAI MIX PARATHA, ALOO BHUJIA, MIX CHUTNEY, GREEN CHUTNEY']
      },
      lunch: {
        regular: ['KADHI (PAKODA, BOONDI), CHANA MASALA, BUTTERMILK'],
        extras: ['DRY CHILLI CHICKEN, PAROTHA,KORMA']
      },
      dinner: {
        regular: ['PANJAR EHEL, KULCHA,BHATURE, AMIR KHER (SWAN)'],
        extras: ['ALOO CHAAT, PASTA']
      }
    },
    wednesday: {
      breakfast: {
        regular: ['VADA, IDLI, IDLI FRY MASALA, SAMBHAR, COCONUT CHUTNEY', 'SAMBHAR, COCONUT CHUTNEY']
      },
      lunch: {
        regular: ['KADDU SABJI, ARHAR DAL, SAMBHAR, BOONDI LADDU, JEMDOO SOUP'],
        extras: ['SPRING ROLL, CHICKEN MALAI TIKKA, EGG BIRYANI']
      },
      dinner: {
        regular: ['PANEER LAPEEZ / CHICKEN CURRY, JEERA RICE,GARLIC NAN, DHANIHA ROTI / LACCHA PARATHA'],
        extras: ['MALAI CHICKEN CHUR, VEG 65, MAGGIE']
      }
    },
    thursday: {
      breakfast: {
        regular: ['PAV BHAJI']
      },
      lunch: {
        regular: ['DAAL MAKHANI, VEG BIRYANI, FRENCH FRIES, MIX RAYTA, RASNA'],
        extras: ['BEL CHICKEN, CORN KABAB, MALAI LADDU']
      },
      dinner: {
        regular: ['MANI MUHAN, FRIED RICE, NOODLES/HONEY CHILLI POTATO'],
        extras: ['CHICKEN ANGARA']
      }
    },
    friday: {
      breakfast: {
        regular: ['MALAI PURI AND VEG CUTLET TOMATO SAUCE']
      },
      lunch: {
        regular: ['RAJMA, ALOO JEERA, LEMON RICE, JALPHERA'],
        extras: ['SAMRT BADDI, KADHAI CHICKEN, SHAH PANEER']
      },
      dinner: {
        regular: ['GHUGHARA ALOO, PURI, PALAK, AMVATHN, RICE (BUTTER/LOCHURA)'],
        extras: ['PANEER BUTTER MASALA']
      }
    },
    saturday: {
      breakfast: {
        regular: ['MASALA DOSA, SAMBHAR, COCONUT CHUTNEY']
      },
      lunch: {
        regular: ['PARATHA(ALOO/BATTU PANEER 2PCS),CHOLE, CHUTNEY, SAMBHAR, ROOHAFZA'],
        extras: ['ROASTED CHICKEN, CHINA SEEKH KABAB, CHATPATA PANEER']
      },
      dinner: {
        regular: ['LAUKI JEERA, DAL HANDI'],
        extras: ['CHICKEN CURRY, HONEY CHILLI, CHATPATA PANEER']
      }
    },
    sunday: {
      breakfast: {
        regular: ['POHA, DAHI, JALEBI', 'EXTRA: ALOO BHUJIA PACKET']
      },
      lunch: {
        regular: ['MIX DAL, SEV TOMATO, LASSI'],
        extras: ['CHICKEN BIRYANI, PANEER TIKKA, MALAI ROLL']
      },
      dinner: {
        regular: ['KADHAI PANEER / EGG CURRY, ARHAR DAL, TANDOORI ROTI /PLAIN, HOT GULAB JAMUN/ WHITE RASGUILA']
      }
    }
  },
  "Hall-4": {
    daily: {
      breakfast: {
        regular: [
          "Sprouts (boiled chana+ moong), sprouts masala chaat, Tea, 2 eggs/ 2 Banana/ Full Milk with Bournvita/Horlicks/ Coffee, 1 Egg/1 Banana with Half Milk, Chocos/Cornflakes, Bread, Butter/ Jam/peanut butter(1 spoon)",
        ],
        extras: [
          "Mix Vegetable Juice"
        ]
      },
      lunch: {
        regular: [
          "Chapati (Plain, Buttered), Pickle, Plain Rice, Salad, Lemon, Rasam, (Curd+1 fruit OR 2 fruits)"
        ],
        extras: [
          "Omelette, Full Fry, Half Fry, Egg Fried Rice, Bread-Omelette, Paneer paratha, Aloo fry, Veg Fried Rice, Paneer Fried Rice, Egg curry, Paneer bhujiya, Egg bhujiya, Veg Raita, Aloo bhaja, Chilli Paneer, Mix Vegetable Juice"
        ]
      },
      dinner: {
        regular: [
          "Chapati (Plain, Buttered), Pickle, Plain Rice, Salad, Gur"
        ],
        extras: [
          "Omelette, Full Fry, Half Fry, Egg Fried Rice, Bread-Omelette, Aloo Fry, Veg Fried Rice, Paneer Fried Rice, Egg curry, Paneer bhujiya, Egg bhujiya, Veg Raita, Aloo bhaja, Chilly Paneer, Mix Vegetable Juice"
        ]
      }
    },
    monday: {
      breakfast: {
        regular: [
          "Masala Idli (9,23) / Fried idli (16,30), Vada (max 3), Idli, Sambar, Nariyal chutney, Tomato chutney"
        ]
      },
      lunch: {
        regular: [
          "Lauki Chana dal, Aloo Shimla/Besan Gatte, Nimbu Shikanji"
        ],
        extras: [
          "Samosa Chat", "Chilli Chicken Dry"
        ]
      },
      dinner: {
        regular: [
          "Ghugni, Arbi, Mix dal, Puri"
        ],
        extras: [
          "Honey Chilli Potato", "Mutton Biryani with Salan"
        ]
      }
    },
    tuesday: {
      breakfast: {
        regular: [
          "Upma(8,22)/Vermicelli (15,29), Hari , Nariyal Chutney"
        ]
      },
      lunch: {
        regular: [
          "Aloo Soyabean, Black Masoor Dal, Tehri, Cucumber Pickle, Papad, Curd/Curd rice,Roohafza"
        ],
        extras: [
          "Fish Curry"
        ]
      },
      dinner: {
        regular: [
          "Pindi Chola,Kulcha (8,22): Chola bhatura (15,29), Chana daal"
        ],
        extras: [
          "Egg biryani", "Pani-puri"
        ]
      }
    },
    wednesday: {
      breakfast: {
        regular: [
          "(9,23) Besan/Moong Dal Chilla,Green Chutney, Tomato Sauce", "(16,30) Sabudana Khichadi"
        ]
      },
      lunch: {
        regular: [
          "Kaddu Jeera, Arhar Dal, Curd rice/Curd, Buttermilk"
        ],
        extras: [
          "Masala Pav", "Chicken Korma"
        ]
      },
      dinner: {
        regular: [
          "Mix Veg Sabzi/Lubiya, Red Masoor Dal"
        ],
        specials: [
          "Malai Kofta (11,25), Kadhai Paneer (18,02), Navrattan dal, Green peas Pulao, Garlic Naan/ Missi roti, Ice cream, Chicken Curry / Butter Chicken"
        ]
      }
    },
    thursday: {
      breakfast: {
        regular: [
          "Uttapam, Sambar, Nariyal chutney, Tomato chutney"
        ]
      },
      lunch: {
        regular: [
          "Kadhi Pakoda, Aloo Jeera, Black Masoor Dal(Chilka), Curd/Curd rice, Rasna"
        ],
        extras: [
          "Shukto"
        ]
      },
      dinner: {
        regular: [
          "Mix Veg Sabzi/Lubiya, Red Masoor Dal"
        ],
        extras: [
          "Chowmein", "Chicken lollipop"
        ]
      }
    },
    friday: {
      breakfast: {
        regular: [
          "Aloo/Vegetable Sandwich (18,1) / Pav Bhaji (11,25)"
        ]
      },
      lunch: {
        regular: [
          "Kundru/ Bharva Karela, Rajma, Nimbu Pani, Curd/Curd rice"
        ],
        extras: [
          "Fish Tikka"
        ]
      },
      dinner: {
        regular: [
          "Bhindi/Aloo Bhindi, Arahar Dal, Tamarind rice, Fruit Raita(4,18),Sewai Kheer(11,24)"
        ],
        extras: [
          "Paneer Tikka", "Chees Roast Chicken"
        ]
      }
    },
    saturday: {
      breakfast: {
        regular: [
          "Dosa(plain/masala/onion), Sambar, Nariyal chutney, Tomato chutney, Tomato sauce, Poha, Sabudana Vada, Bhujiya Sev, Jalebi, Dahi"
        ]
      },
      lunch: {
        regular: [
          "Aloo/Onion/Mix Paratha/Paneer Paratha (1piece), green chutney, Chana, Buttermilk,Curd/Curd rice"
        ],
        extras: [
          "Corn Cutlet"
        ]
      },
      dinner: {
        regular: [
          "Jajor, Dalma, Jeera Rice, Sooji Halwa"
        ],
        extras: [
          "Paneer Roll", "Chicken Biryani"
        ]
      }
    },
    sunday: {
      breakfast: {
        regular: [
          "Poha, Sabudana Vada, Bhujiya Sev, Jalebi, Dahi"
        ]
      },
      lunch: {
        regular: [
          "Veg Pulao, Mix veg moong Dal, Aloo Lobia Curd/Curd rice, lassi"
        ],
        extras: [
          "Litti Chokha", "Fish Fingers"
        ]
      },
      dinner: {
        regular: [
          "Taroi, Dalma, Jeera Rice, Sooji Halwa"
        ],
        extras: [
          "Paneer Roll", "Chicken Biryani"
        ]
      }
    },
    alternate: {
      breakfast: {
        regular: [
          "2 eggs/2 banana+200 ml milk Or 4 banana Or 4 eggs Or (300 ml milk+1 banana/ 1 egg)"
        ]
      }
    }
  },

  "Hall-6": {
    daily: {
      breakfast: {
        regular: [
          "Sprouted Grains, 250ml Milk with 1 spoon of Bournvita/ Tea/ 2 Eggs, Chocos/Cornflakes (alternate days), Bread With Butter, jam, Daliya / Oats with fruits(apple, Banana, Anar) (alternate days)"
        ]
      },
      lunch: {
        regular: [
          "Chapati (Plain, Buttered), Pickle, Plain Rice, Salad, Lemon (4 Pieces), Fruits / curd"
        ],
        extras: [
          "Omelette, Full Fry, Half Fry, Egg Fried Rice, Bread Omlete, Aloo Fry, Fried Rice, Paneer Fried Rice, Tomato Chutney, Jeera Rice, JeeraAloo, DCBM, Paneer Bhujiya (Except Tuesday), Plain/ Veg /Cheese Maggi"
        ]
      },
      dinner: {
        regular: [
          "Chapati (Plain, Buttered), Rasam, Pickle, Plain Rice, Salad, Lemon (4 Pieces)"
        ],
        extras: [
          "Omelette, Full Fry, Half Fry, Egg Fried Rice, Bread Omlete, AlooFry, Fried Rice, Paneer Fried Rice, Tomato Chutney, Jeera Rice, JeeraAloo, DCBM, Paneer Bhujiya (Except Tuesday), Plain/ Veg /Cheese Maggi"
        ]
      }
    },
    monday: {
      breakfast: {
        regular: [
          "Veg-mayonnaise and Aloo Sandwich (Grilled and Plain) / Macroni"
        ]
      },
      lunch: {
        regular: [
          "Veg Kolhapori/ Mix veg, black masoor dal, Curd, Boondi Raita, Butter milk"
        ],
        extras: [
          "Corn chat", "Egg curry", "Fruit chat"
        ]
      },
      dinner: {
        regular: [
          "Yellow Matar gravy, Aata poori, Masala Kachori, Mix dal, Kheer / Sewai"
        ],
        extras: [
          "Paneer paratha, fish finger", "Cheese Cigar roll"
        ]
      }
    },
    tuesday: {
      breakfast: {
        regular: [
          "Idli, Fry Idli / Uttapam , Nariyal Chutney, Sambhar, Red chutney"
        ]
      },
      lunch: {
        regular: [
          "Aloo palak dry , Arhar dal , Curd rice , Jaljeera"
        ],
        extras: [
          "Chaat"
        ]
      },
      dinner: {
        regular: [
          "Paneer Butter Masala / Kadhai paneer, garlic Naan, Missi / Lacha Paratha , Mix dal (Arhar, Chana, Masoor), Matar Pulao, Ice- Cream / Laungi , Aloo fries"
        ]
      }
    },
    wednesday: {
      breakfast: {
        regular: [
          "Paav Bhaji / Hariyali kabab"
        ]
      },
      lunch: {
        regular: [
          "Aloo Parval, Veg Hyderabadi Biryani, Panch ratna dal, Roasted Papad , Boondi Raita , nimbu pani"
        ],
        extras: [
          "Fish Curry", "Chicken Fry", "Bhelpuri", "Rasmalai"
        ]
      },
      dinner: {
        regular: [
          "Rajasthani dal , Aloo Bhindi Masala"
        ]
      }
    },
    thursday: {
      breakfast: {
        regular: [
          "Aloo tamtar matar gravy, plain paratha / Sooji halwa , Aloo tamtar matar gravy , Poori"
        ]
      },
      lunch: {
        regular: [
          "Razama, Kathal dry, Dahi Vada/Curd / fruit , jaljeera"
        ],
        extras: [
          "Egg Roll", "Paneer Roll", "Fruit Chat"
        ]
      },
      dinner: {
        regular: [
          "Masala baigan , Masala Aloo fry , Dal Makhani"
        ],
        extras: [
          "White Roasted chicken", "Paneer momos (Steam + fry)"
        ]
      }
    },
    friday: {
      breakfast: {
        regular: [
          "Stuffed paratha (aloo,Pyaz) ,Green chutney, curd / Sabudana cutlet, green chutney"
        ]
      },
      lunch: {
        regular: [
          "Kadhi Pakodi / Boondi Kadhi , Tamarind Rice , Aloo Beans , Curd / Fruit / Nimboo pani"
        ],
        extras: [
          "Chilli chicken", "Dahi bhalla chat", "Fruit chat"
        ]
      },
      dinner: {
        regular: [
          "Pindi Chhole/Chola, Bhatura/ Aloo Paneer Kulcha, Egg Curry(1 Pc.*)/ Dry Rasgulla coconut powder / Meetha , samosa, Pyaz bhajiya (1 spoon)"
        ]
      }
    },
    saturday: {
      breakfast: {
        regular: [
          "Masala Dosa, Plain Dosa, Sambhar, Singdana Chutney, Red Chutney"
        ]
      },
      lunch: {
        regular: [
          "Dum Aloo /Aloo matar Tamatar Gravy , Red masoor Dal, Paratha (Aloo, Dal, Methi ), Green chutney , Mix Veg / Kheera raita / Fruit / Curd / Lassi"
        ],
        extras: [
          "Paneer Paratha", "Egg biryani", "Fish fry", "Fruit chat"
        ]
      },
      dinner: {
        regular: [
          "Kaddu takta meetha , Arhar dal"
        ]
      }
    },
    sunday: {
      breakfast: {
        regular: [
          "Poha Spicy / Poha Gujrati, Jalebi, Sev, Curd"
        ]
      },
      lunch: {
        regular: [
          "Paneer- Do-Pyaza/ Afghani panner , Chicken gravy / Butter Chicken (1 pc) , Chicken Biryani/veg fried rice with pudina chutney, Rajasthani dal,Fruit Raita, Rasna"
        ]
      },
      dinner: {
        regular: [
          "Paratha, kala chana gunji, Mix dal, Fruit salad"
        ],
        extras: [
          "Chicken biryani, Dry Manchurian / Noodles"
        ]
      }
    }
  },
  "Hall-12": {
    daily: {
      breakfast: {
        regular: [
          "BREAD-(WHITE & BROWN)/RUSK), JAM-20GM/BUTTER-30GM/MILK (BOURNVITA/HORLICKS/COFFEE), EGG(2PCS), TEA, DALIA, CORNFLAKES"
        ]
      },
      lunch: {
        regular: [
          "Roti (PLAIN AND BUTTERED), PALAIN RICE, PICKLE, Raita/Dahi/Fruit, Nimbu Paani"
        ],
        extras: [
          "BUTTER, EGG, PANEER, FRY"
        ]
      },
      dinner: {
        regular: [
          "Roti (PLAIN AND BUTTERED), PALAIN RICE, PICKLE"
        ],
        extras: [
          "BUTTER, EGG, PANEER, FRY, MILK"
        ]
      }
    },
    monday: {
      breakfast: { regular: ["Macroni Veg Cutlet Sauce"] },
      lunch: {
        regular: ["Mix Veg Gravy, Dal Makhani, Lemon Coriander Rice, Rose Lassi"],
        extras: ["Imarti Rabri", "Butter Chicken", "Paneer Do Pyaza"]
      },
      dinner: {
        regular: ["Veg Biryani, Aloo Matar Tamatar, Arhar Dal Tadka, Masala Pyaz"],
        extras: ["Chicken Tangadi"]
      }
    },
    tuesday: {
      breakfast: { regular: ["Pav Bhaji"] },
      lunch: {
        regular: ["White Matar Gravy, Chana Dal, Dal Paratha, Methi Paratha, Chhach"],
        extras: ["Egg Curry", "Peda", "Paneer Lababdar"]
      },
      dinner: {
        regular: ["Baigan Bharta, Masoor Dal, Custard"],
        extras: ["Paneer Dosa"]
      }
    },
    wednesday: {
      breakfast: { regular: ["Uttapam, Sambhar, Nariyal Chatni"] },
      lunch: {
        regular: ["Aloo Jeera, Pyaz Palak, Kadhi Pakauda, Masoor Dal Papad"],
        extras: ["Chicken Tikka Rice", "Chilli Paneer", "Malai Boondi"]
      },
      dinner: {
        regular: ["Matar Paneer, Arhar dal Tadka"],
        extras: ["Chicken Tikka Masala"]
      }
    },
    thursday: {
      breakfast: { regular: ["Bombay Sandwich, Veg Cutlet, Green Chatni"] },
      lunch: {
        regular: ["Aloo Shimla, Rajma, Frymes, Fruit Raita"],
        extras: ["Chilli Chicken", "Paneer Tikka Masala"]
      },
      dinner: {
        regular: ["Pindi Chhola, Lal masoor Dal, Poori, Kheer/Sewai"],
        extras: ["Chicken Changezi"]
      }
    },
    friday: {
      breakfast: { regular: ["Poha, Jalebi & Curd, Extra-Aloo Bhujia"] },
      lunch: {
        regular: ["Chhola, Paratha:-(Pyaz PaneerMix, Aloo Pyaz, Chutney (only two Paneer Paratha))"],
        extras: ["Butter", "Milk Barfi", "Chicken Lolipop"]
      },
      dinner: {
        regular: ["Bhindi Pyaz Masala, Panchratan Dal"],
        extras: ["Egg Roll", "Paneer Butter Masala", "Chicken Biryani"]
      }
    },
    saturday: {
      breakfast: { regular: ["Dosa, Sambhar, Coconut Chatni"] },
      lunch: {
        regular: ["Sev Tamatar, Lal Masor Dal, Rose Lassi"],
        extras: ["Kadhai Paneer", "Moong Dal Halwa", "Chicken Pop corn"]
      },
      dinner: {
        regular: ["Aloo Chana Masala, Chana Dal Tadka, Jeera Rice, Plain Paratha Tikona"],
        extras: ["Papdi Chaat/Aloo Chat", "Chicken Kasa"]
      }
    },
    sunday: {
      breakfast: { regular: ["Idli, Fry Idli, Wada, Sambhar, Coconut Chatni"] },
      lunch: {
        regular: ["Panjabi Kaddu, Arhar Dal"],
        extras: ["Ras Malai", "Chilli Mushroom"]
      },
      dinner: {
        regular: ["Paneer/Cheese, Chicken Curry, Moong Dal, Garlic Naan, Tandoori Roti, Pulao, Gulab Jamun"],
        extras: []
      }
    }
  },
  "Hall-13": {
    daily: {
      breakfast: {
        regular: [
          "Regular: Sprouts (moong, chana), Dalia, Tea/ Milk (Horlicks or Bourn-Vita)/ Coffee, Egg (2 pcs.), Cornflakes/Jaggery",
          "Optional: Regular Breakfast/Bread, (Butter/Jam/Peanut Butter), Toast",
          "Extras: Chocos, bread omlet"
        ]
      },
      lunch: {
        regular: [
          "Roti (Plain/Butter), Rice, Dal, Curry, Salad, Curd Fruits, Sick Diet, Khichdi/Jaggery"
        ]
      },
      dinner: {
        regular: [
          "Roti (Plain/Butter), Rice, Dal, Curry, Salad, Curd Fruits, Sick Diet, Khichdi/Jaggery"
        ]
      }
    },
    monday: {
      breakfast: { regular: ["Pasta, Cutlet(2pcs)/Bombay Sandwich, Veg sandwich Tomato Chutney and Sweet Chutney"] },
      lunch: {
        regular: ["Rajma Masala, Bhindi Do Pyaza, Lemon Rice"],
        extras: ["Egg Biryani", "Paneer Angara"]
      },
      dinner: {
        regular: ["Veg Kofta/ Lauki Kofta, Smoky Dal, Thandai"],
        extras: ["Kathi Roll", "Afgan Chaap"]
      }
    },
    tuesday: {
      breakfast: { regular: ["Samosa with matar/ Mix Pakoda, Green Chutney, Red Chutney"] },
      lunch: {
        regular: ["Punjabi Kadhi, Aloo Bhujia, Jeera Rice, Frymes, Mint Cucumber Raita"],
        extras: ["Chilly Paneer", "Italian Pasta"]
      },
      dinner: {
        regular: ["Choley, Ajwain puri, Arhar Dal, Rice, Kheer, Fruit Custard"],
        extras: ["Paneer Butter Masala", "Pani Puri"]
      }
    },
    wednesday: {
      breakfast: { regular: ["Uttapam / Plain idli , Masala Idli ,Coconut Chutney, Sambhar"] },
      lunch: {
        regular: ["Aloo Shimla Gravy, Kathal Masala, Plain paratha, Mix Dal, Jal Jeera"],
        extras: ["Burger", "kathi roll"]
      },
      dinner: {
        regular: ["Paneer Do Pyaza/Paneer Korma, Egg Curry, Chicken Curry, Moong Dal (Bhaja), Ice Cream"],
        extras: []
      }
    },
    thursday: {
      breakfast: { regular: ["Aloo Paratha with Curd/ Microni, Green chutney"] },
      lunch: {
        regular: ["Khata meetha pethe/ Karela pyaza, Peas Pulav, Chana Dal, Masala Soda"],
        extras: ["Chicken 65 Boneless", "Aloo Tikki chaat"]
      },
      dinner: {
        regular: ["Black Chana Masala, Roti, Arhar dal"],
        extras: ["Rosted Chicken", "Paneer Khurchan"]
      }
    },
    friday: {
      breakfast: { regular: ["Pav Bhaji"] },
      lunch: {
        regular: ["Paneer paratha, Dal Paratha, White Matar, chutney, Sikanji, Fried mirchi"],
        extras: ["Papdi Chaat", "Tikki Chaat"]
      },
      dinner: {
        regular: ["Corn Palak, Dal Makhani, Jeera Rice"],
        extras: ["Pani Puri", "Chicken Biryani", "Spring Roll"]
      }
    },
    saturday: {
      breakfast: { regular: ["Poha With Jalebi"] },
      lunch: {
        regular: ["Chholey Bhaturey, Rose Lassi, Fried mirchi"],
        extras: ["Kathi Roll", "Chees Ball"]
      },
      dinner: {
        regular: ["Turai Chana, Arhar dal"],
        extras: ["Chicken tikka rice", "French Fry"]
      }
    },
    sunday: {
      breakfast: { regular: ["Dosa Sambhar, Coconut chutney"] },
      lunch: {
        regular: ["Kundru Aloo, Panchratan Dal, Boondi Raita"],
        extras: ["Crispy Corn", "Kacha Nimbu"]
      },
      dinner: {
        regular: ["Sahi Paneer, Paneer Lababdar, (Balck Masoor), Veg Pulao, Missy Roti, Garlic Naan, Tandoori Roti, Rasgulla/ Gulab Jamun, Kuchumber Salad, Papad"],
        extras: []
      }
    }
  },

};

async function seedMenuData() {
  try {
    await connectDB();
    console.log('[SEED] Connected to database');
    
    // Clear existing menu data
    await Meal.deleteMany({});
    console.log('[SEED] Cleared existing menu data');

    const mealsToInsert = [];

    // Process each hall
    for (const [hallName, hallData] of Object.entries(menuData)) {
      // Process each day
      for (const [day, dayData] of Object.entries(hallData)) {
        // Process each meal type
        for (const [mealType, mealData] of Object.entries(dayData)) {
          const meal = {
            hallName,
            month: 'July',
            year: 2025,
            day: day.toLowerCase(),
            mealType: mealType.toLowerCase(),
            menuItems: {
              regular: mealData.regular || [],
              extras: mealData.extras || [],
              special: mealData.special || [],
              alternatives: mealData.alternatives || []
            },
            price: 50, // Default price, you can adjust
            available: true
          };
          mealsToInsert.push(meal);
        }
      }
    }

    // Insert all meals
    await Meal.insertMany(mealsToInsert);
    console.log(`[SEED] Successfully seeded ${mealsToInsert.length} meal entries`);
  } catch (error) {
    console.error('[SEED] Error seeding menu data:', error);
    throw error;
  }
}

module.exports = { seedMenuData };