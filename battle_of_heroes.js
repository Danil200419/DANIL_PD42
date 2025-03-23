// Enum для типів героїв
var HeroType;
(function (HeroType) {
    HeroType["Warrior"] = "WARRIOR";
    HeroType["Mage"] = "MAGE";
    HeroType["Archer"] = "ARCHER";
})(HeroType || (HeroType = {}));
// Enum для типів атак
var AttackType;
(function (AttackType) {
    AttackType["Physical"] = "PHYSICAL";
    AttackType["Magical"] = "MAGICAL";
    AttackType["Ranged"] = "RANGED";
})(AttackType || (AttackType = {}));
// Лічильник для унікальних ID героїв
var heroIdCounter = 1;
/**
 * Функція створення нового героя
 * @param name Ім'я героя
 * @param type Тип героя (Warrior, Mage, Archer)
 * @returns Новий об'єкт героя
 */
function createHero(name, type) {
    var baseStats;
    // Базові характеристики в залежності від типу героя
    switch (type) {
        case HeroType.Warrior:
            baseStats = { health: 120, attack: 20, defense: 15, speed: 10 };
            break;
        case HeroType.Mage:
            baseStats = { health: 80, attack: 30, defense: 5, speed: 20 };
            break;
        case HeroType.Archer:
            baseStats = { health: 100, attack: 25, defense: 10, speed: 15 };
            break;
    }
    return {
        id: heroIdCounter++,
        name: name,
        type: type,
        attackType: determineAttackType(type),
        stats: baseStats,
        isAlive: true
    };
}
/**
 * Визначає тип атаки залежно від типу героя
 * @param type Тип героя
 * @returns Тип атаки
 */
function determineAttackType(type) {
    switch (type) {
        case HeroType.Warrior: return AttackType.Physical;
        case HeroType.Mage: return AttackType.Magical;
        case HeroType.Archer: return AttackType.Ranged;
    }
}
/**
 * Функція розрахунку пошкодження
 * @param attacker Атакуючий герой
 * @param defender Герой, що захищається
 * @returns Результат атаки
 */
function calculateDamage(attacker, defender) {
    var baseDamage = attacker.stats.attack - defender.stats.defense; // Базовий урон
    var damage = baseDamage > 0 ? baseDamage : 1; // Мінімальний урон = 1
    var isCritical = Math.random() < 0.2; // 20% шанс критичного удару
    var finalDamage = isCritical ? damage * 2 : damage;
    defender.stats.health -= finalDamage;
    // Оновлення статусу життя героя
    if (defender.stats.health <= 0) {
        defender.isAlive = false;
        defender.stats.health = 0;
    }
    return {
        damage: finalDamage,
        isCritical: isCritical,
        remainingHealth: defender.stats.health
    };
}
/**
 * Generic функція для пошуку героя в масиві за властивістю
 * @param heroes Масив героїв
 * @param property Властивість для пошуку
 * @param value Значення властивості
 * @returns Знайдений герой або undefined
 */
function findHeroByProperty(heroes, property, value) {
    for (var _i = 0, heroes_1 = heroes; _i < heroes_1.length; _i++) {
        var hero = heroes_1[_i];
        if (hero[property] === value) {
            return hero;
        }
    }
    return undefined;
}
/**
 * Функція проведення раунду бою між двома героями
 * @param hero1 Перший герой
 * @param hero2 Другий герой
 * @returns Текстовий опис результату раунду
 */
function battleRound(hero1, hero2) {
    if (!hero1.isAlive || !hero2.isAlive) {
        return "Один з героїв вже мертвий!";
    }
    // Герой з вищою швидкістю атакує першим
    var firstAttacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
    var secondAttacker = firstAttacker === hero1 ? hero2 : hero1;
    var firstAttack = calculateDamage(firstAttacker, secondAttacker);
    var result = "".concat(firstAttacker.name, " \u0430\u0442\u0430\u043A\u0443\u0454 ").concat(secondAttacker.name, " \u0456 \u043D\u0430\u043D\u043E\u0441\u0438\u0442\u044C ").concat(firstAttack.damage, " ").concat(firstAttack.isCritical ? "(Критичний удар!)" : "", ". \u0417\u0430\u043B\u0438\u0448\u043E\u043A \u0437\u0434\u043E\u0440\u043E\u0432'\u044F: ").concat(secondAttacker.stats.health, ".\n");
    if (!secondAttacker.isAlive) {
        result += "".concat(secondAttacker.name, " \u043F\u0440\u043E\u0433\u0440\u0430\u0432 \u0431\u0456\u0439!");
        return result;
    }
    var secondAttack = calculateDamage(secondAttacker, firstAttacker);
    result += "".concat(secondAttacker.name, " \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0454 \u0456 \u043D\u0430\u043D\u043E\u0441\u0438\u0442\u044C ").concat(secondAttack.damage, " ").concat(secondAttack.isCritical ? "(Критичний удар!)" : "", ". \u0417\u0430\u043B\u0438\u0448\u043E\u043A \u0437\u0434\u043E\u0440\u043E\u0432'\u044F: ").concat(firstAttacker.stats.health, ".\n");
    if (!firstAttacker.isAlive) {
        result += "".concat(firstAttacker.name, " \u043F\u0440\u043E\u0433\u0440\u0430\u0432 \u0431\u0456\u0439!");
    }
    return result;
}
// === Практичне застосування ===
// Масив героїв
var heroes = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леголас", HeroType.Archer)
];
// Пошук героя
var foundHero = findHeroByProperty(heroes, "type", HeroType.Mage);
console.log("Знайдений герой:", foundHero);
// Проведення бою
var battleResult = battleRound(heroes[0], heroes[1]);
console.log(battleResult);
// Додаткові раунди боїв
var secondBattle = battleRound(heroes[0], heroes[2]);
console.log(secondBattle);
