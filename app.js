var bd = {
    Init: function () {
        for (var day = 1; day <= 31; day++) {
            $('#bd-day').append('<option value="' + day + '">' + day + '</option>');
        }

        var months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        for (var i = 0; i < months.length; i++) {
            $('#bd-month').append('<option value="' + (i + 1) + '">' + months[i] + '</option>');
        }

        var currentYear = new Date().getFullYear();
        var startYear = currentYear - 100; // ย้อนหลัง 100 ปี
        for (var i = currentYear; i >= startYear; i--) {
            $('#bd-year').append($('<option>', {
                value: i + 543,
                text: i + 543
            }));
        }

        $(".lucky-number").addClass("d-none")
    },

    CalculateNumber: function () {

        $(".lucky-number").removeClass("d-none");
        $('#lucky-number-card').empty();
        let bdnum = $("#rec-number-submit-btn").data('bd-num');
        let bddaynum = $("#rec-number-submit-btn").data('bd-day-num');
        const info = this.getLuckyNumbersAndInfo(bdnum, bddaynum);
        $("#result").text();

        const icons = {
            "career": '<i class="fas fa-briefcase"></i>',      // ไอคอนกระเป๋าทำงาน (Career)
            "finance": '<i class="fas fa-coins"></i>',         // ไอคอนเหรียญ (Finance)
            "love": '<i class="fas fa-heart"></i>',            // ไอคอนหัวใจ (Love)
            "health": '<i class="fas fa-stethoscope"></i>'     // ไอคอนเครื่องมือแพทย์ (Health)
        };

        for (let index = 0; index < info.luckyNumbersSets.length; index++) {
            //let lucky = info.luckyNumberWithAreas[index].join('');
            //let luckyExplain = info.explainedSets[index];

            var concatenatedNumbers = info.luckyNumberWithAreas[index].map(function(item) {
                return item.number;
            }).join('');

            var concatenatedArea = info.luckyNumberWithAreas[index].map(function(item) {
                return icons[item.area];
            }).join('');

            
            
            var cardHtml = '<div class="col">' +
                '<div class="card card-number" onclick="bd.selected(this)">' +
                '<div class="card-body text-center">' +
                '<h5 class="card-title">' + concatenatedNumbers + '</h5>' +
                '<div class="d-flex justify-content-around mt-3">'+ concatenatedArea +'</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            $('#lucky-number-card').append(cardHtml);
        };
    },
    selected: function (item) {
        let selected = $(item).hasClass('card-selected');
        $("#lucky-number-card .card-number").removeClass('card-selected');
        if (!selected)
            $(item).addClass('card-selected');
    },
    generateRandomNumbers: function (baseNumber) {
        var randomNumbers = [];
        for (var i = 0; i < 3; i++) {
            // สร้างตัวเลขสุ่มจากค่าฐานบวกค่าที่คูณด้วยตัวเลขสุ่ม
            // var randomNum = (baseNumber * Math.floor(Math.random() * 900)) +100;
            var randomNum = Math.floor(Math.random() * 900) + 100;
            randomNumbers.push(randomNum);
        }
        return randomNumbers;
    },
    generateRandomThreeDigitNumber: function () {
        return Math.floor(Math.random() * 900) + 100; // สุ่มในช่วง 100 ถึง 999
    },


    reduceToSingleDigit: function (num) {
        while (num >= 10) {
            num = num.toString().split('').reduce(function (acc, digit) {
                return acc + parseInt(digit, 10);
            }, 0);
        }
        return num;
    },
    
    getUniqueLuckyNumbers: function (suitableNumbers) {
        // ฟังก์ชันสุ่มเลข 3 ตัวจาก suitableNumbers โดยไม่มีเลขซ้ำในแต่ละชุด
        var selectedNumbers = [];
        var remainingNumbers = [...suitableNumbers]; // สร้างสำเนา array เพื่อไม่ให้ซ้ำ

        for (var i = 0; i < 3; i++) {
            var randomIndex = Math.floor(Math.random() * remainingNumbers.length);
            selectedNumbers.push(remainingNumbers[randomIndex]);
            remainingNumbers.splice(randomIndex, 1); // ลบเลขที่เลือกแล้วออกเพื่อไม่ให้ซ้ำในชุดเดียวกัน
        }

        return selectedNumbers;
    },
    getThreeUniqueSets: function(suitableNumbers) {
        // ฟังก์ชันสุ่ม 3 ชุด โดยแต่ละชุดไม่ซ้ำกัน
        var allSets = new Set(); // ใช้ Set เพื่อป้องกันชุดซ้ำกัน
        var uniqueSets = [];

        while (uniqueSets.length < 3) {
            var luckyNumbers = this.getUniqueLuckyNumbers(suitableNumbers);
            var stringifiedSet = JSON.stringify(luckyNumbers); // แปลงเป็น string เพื่อตรวจสอบความซ้ำกัน

            if (!allSets.has(stringifiedSet)) {
                allSets.add(stringifiedSet); // ถ้าไม่ซ้ำให้เพิ่มเข้าไปใน Set
                uniqueSets.push(luckyNumbers); // เก็บชุดตัวเลขที่ไม่ซ้ำกัน
            }
        }

        return uniqueSets;
    },
   
    // ฟังก์ชันสุ่มเลขที่ไม่ซ้ำ Area ในแต่ละชุด
    getUniqueNumbersFromAreas: function (luckyAreas) {
        var selectedNumbers = [];

        // เลือกตัวเลขจากแต่ละ Area และไม่ซ้ำ Area ในชุดเดียวกัน
        for (var area in luckyAreas) {
            var numbersInArea = luckyAreas[area];
            if (numbersInArea.length > 0) {
                var randomIndex = Math.floor(Math.random() * numbersInArea.length);
                selectedNumbers.push({
                    number: numbersInArea[randomIndex],
                    area: area
                });
            }
        }
        return selectedNumbers;
    },
    getThreeUniqueLuckyNumbersWithArea: function (luckyAreas) {
        const selectedNumbersWithArea = [];
        const areas = ["career", "finance", "love", "health"];
        const areasTH = ["การงาน", "การเงิน", "ความรัก", "สุขภาพ"];
    
        // สุ่มเลือก 3 area โดยไม่ให้ซ้ำกัน
        while (selectedNumbersWithArea.length < 3) {
            let randomArea = areas[Math.floor(Math.random() * areas.length)];
            // ตรวจสอบว่า area นี้ยังไม่ได้เลือก
            if (!selectedNumbersWithArea.some(item => item.area === randomArea)) {
                let areaNumbers = luckyAreas[randomArea];
                let randomNumber = areaNumbers[Math.floor(Math.random() * areaNumbers.length)];
    
                // เพิ่ม area และ number ในรูปแบบ JSON
                selectedNumbersWithArea.push({ area: randomArea, number: randomNumber });
            }
        }
    
        return selectedNumbersWithArea;
    },   
    // ฟังก์ชันสุ่ม 3 ชุดที่ไม่ซ้ำกันและไม่ซ้ำ Area ในแต่ละชุด
    getThreeUniqueSetsOfNumbers: function (luckyAreas) {
        var allSets = new Set(); // ใช้ Set เพื่อเก็บชุดที่ไม่ซ้ำกัน
        var uniqueSets = [];

        // สุ่ม 3 ชุด โดยตรวจสอบไม่ให้ซ้ำกัน
        while (uniqueSets.length < 3) {
            var selectedSet = this.getThreeUniqueLuckyNumbersWithArea(luckyAreas);
            // var stringifiedSet = JSON.stringify(selectedSet.map(item => item.number)); // แปลงเป็น string เพื่อตรวจสอบความซ้ำกัน

            // if (!allSets.has(stringifiedSet)) {
            //     allSets.add(stringifiedSet); // ถ้าไม่ซ้ำให้เพิ่มเข้าไปใน Set
            //     uniqueSets.push(selectedSet); // เก็บชุดตัวเลขที่ไม่ซ้ำกัน
            // }

            uniqueSets.push(selectedSet); // เก็บชุดตัวเลขที่ไม่ซ้ำกัน
        }

        return uniqueSets;
    },
    explainLuckyNumbers: function (numbers) {
        // ฟังก์ชันที่อธิบายผลเสริมดวงของแต่ละเลข
        var explanations = {
            1: "เสริมด้านความเป็นผู้นำ ความมั่นใจ และการเป็นที่น่าเคารพ",
            2: "เสริมด้านความสัมพันธ์ ความอ่อนโยน และความรักที่มั่นคง",
            3: "เสริมด้านความคิดสร้างสรรค์ พลังงานเชิงบวก และการสื่อสาร",
            4: "เสริมด้านการวางแผน ความมั่นคง และการบริหารจัดการ",
            5: "เสริมด้านการคิดวิเคราะห์ การใช้เหตุผล และความมั่นคงทางอารมณ์",
            6: "เสริมด้านเสน่ห์ ความสวยงาม และการเงินที่มั่นคง",
            7: "เสริมด้านการใคร่ครวญ การค้นหาความหมายในชีวิต และความสงบ",
            8: "เสริมด้านอำนาจ บารมี และความสำเร็จทางการเงิน",
            9: "เสริมด้านจิตวิญญาณ ความเมตตา และการให้"
        };

        return numbers.map(function(number) {
            return number + " เสริมด้าน: " + explanations[number];
        });
    },
    getLuckyNumbersAndInfo: function (birthNumber, dayOfWeekNumber) {
        // https://horoscope.kapook.com/view137383.html
        // รวมตัวเลขวันเกิดและวันในสัปดาห์
        var totalNumber = this.reduceToSingleDigit(birthNumber + dayOfWeekNumber);

        // ตัวเลขที่เหมาะสมและไม่เหมาะสมตามวันในสัปดาห์ (ตัวอย่าง)
        var recommendations = {
            1: { suitable: [2, 4, 5, 6], notSuitable: [3, 7] },
            2: { suitable: [2, 4, 5, 6], notSuitable: [1, 8] },
            3: { suitable: [3, 5, 6, 8], notSuitable: [0, 1, 7] },
            4: { suitable: [2, 4, 5, 6], notSuitable: [3, 8] },
            5: { suitable: [1, 3, 5, 6, 9], notSuitable: [7, 8] },
            6: { suitable: [2, 3, 4, 5, 6], notSuitable: [7, 0] },
            7: { suitable: [1, 4, 8, 9], notSuitable: [2, 5] }
        };

        // เลือกชุดข้อมูลที่เหมาะสมจากวันเกิด
        var dayRecommendations = recommendations[dayOfWeekNumber + 1];

        // จัดกลุ่มตัวเลขตาม Areas ต่าง ๆ
        var luckyAreas = {
            "career": dayRecommendations.suitable.slice(0, 2),
            "finance": dayRecommendations.suitable.slice(2, 4),
            "love": dayRecommendations.suitable.slice(1, 3),
            "health": dayRecommendations.suitable.slice(3, 4)
        };

        // สุ่มเลขมงคล 3 ชุด โดยแต่ละชุดไม่ซ้ำกัน
        var threeSetsOfLuckyNumbers = this.getThreeUniqueSets(dayRecommendations.suitable);

        // เพิ่มคำอธิบายเกี่ยวกับผลเสริมดวงของแต่ละเลขในชุด
        var explainedSets = threeSetsOfLuckyNumbers.map(function(set) {
            return explainLuckyNumbers(set);
        });

         // สุ่มเลขที่ไม่ซ้ำและจับคู่กับ Area
         // สุ่ม 3 ชุดที่ไม่ซ้ำกันและไม่ซ้ำ Area ในแต่ละชุด
         var selectedNumbersWithAreas = this.getThreeUniqueSetsOfNumbers(luckyAreas);
  

        // ส่งคืนผลลัพธ์ JSON
        return {
            "birthNumber": birthNumber,
            "dayOfWeekNumber": dayOfWeekNumber,
            "totalNumber": totalNumber,
            "suitableNumbers": dayRecommendations.suitable,
            "notSuitableNumbers": dayRecommendations.notSuitable,
            "luckyNumbersSets": threeSetsOfLuckyNumbers,
            "explainedSets": explainedSets,
            "luckyNumberWithAreas": selectedNumbersWithAreas,
            "luckyAreas": luckyAreas
        };
    }
}

$("#rec-number-submit-btn").on('click', function () {
    bd.CalculateNumber();
})


$(".rec-number select").on('change', function () {
    let d = $("#bd-day").val();
    let m = $("#bd-month").val();
    let y = $("#bd-year").val();
    let valid = (!d || !m || !y) == 1;

    var birthDate = new Date(y - 543, m - 1, d);
    var dayOfWeekNumber = birthDate.getDay();
    var daysOfWeek = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    var dayOfWeek = daysOfWeek[dayOfWeekNumber];

    // console.log(d, m, y, valid, dayOfWeekNumber, dayOfWeek);

    // let b = reduceToSingleDigit(d + m + y);
    // var result = bd.getLuckyNumbersAndInfo(b, dayOfWeekNumber);
    // $('#result').text(JSON.stringify(result, null, 4));


    $("#rec-number-submit-btn").attr('data-bd', d + m + y)
        .attr('data-bd-num', reduceToSingleDigit(d + m + y))
        .attr('data-bd-day-num', dayOfWeekNumber)
        .attr('data-bd-day', dayOfWeek)
        .attr('disabled', valid);
})

function reduceToSingleDigit(num) {
    while (num >= 10) {
        num = num.toString().split('').reduce(function (acc, digit) {
            return acc + parseInt(digit, 10);
        }, 0);
    }
    return num;
}

// ฟังก์ชันที่อธิบายผลเสริมดวงของแต่ละเลข
function explainLuckyNumbers(numbers) {
    var explanations = {
        1: "เสริมด้านความเป็นผู้นำ ความมั่นใจ และการเป็นที่น่าเคารพ",
        2: "เสริมด้านความสัมพันธ์ ความอ่อนโยน และความรักที่มั่นคง",
        3: "เสริมด้านความคิดสร้างสรรค์ พลังงานเชิงบวก และการสื่อสาร",
        4: "เสริมด้านการวางแผน ความมั่นคง และการบริหารจัดการ",
        5: "เสริมด้านการคิดวิเคราะห์ การใช้เหตุผล และความมั่นคงทางอารมณ์",
        6: "เสริมด้านเสน่ห์ ความสวยงาม และการเงินที่มั่นคง",
        7: "เสริมด้านการใคร่ครวญ การค้นหาความหมายในชีวิต และความสงบ",
        8: "เสริมด้านอำนาจ บารมี และความสำเร็จทางการเงิน",
        9: "เสริมด้านจิตวิญญาณ ความเมตตา และการให้"
    };

    return numbers.map(function(number) {
        return number + " เสริมด้าน: " + explanations[number];
    });
}

bd.Init();