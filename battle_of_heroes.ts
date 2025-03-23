// Enum для типів героїв
enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER"
}

// Enum для типів атак
enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED"
}

// Інтерфейс для характеристик героя
interface HeroStats {
    health: number;   // Очки здоров'я
    attack: number;   // Сила атаки
    defense: number;  // Захист
    speed: number;    // Швидкість
}

// Інтерфейс для героя
interface Hero {
    id: number;                 // Унікальний ідентифікатор
    name: string;               // Ім'я героя
    type: HeroType;             // Тип героя
    attackType: AttackType;     // Тип атаки
    stats: HeroStats;           // Характеристики героя
    isAlive: boolean;           // Статус життя героя
}

// Тип для результату атаки
type AttackResult = {
    damage: number;             // Сума нанесеного пошкодження
    isCritical: boolean;        // Чи був критичний удар
    remainingHealth: number;    // Залишок здоров'я у жертви
}

// Лічильник для унікальних ID героїв
let heroIdCounter = 1;

/**
 * Функція створення нового героя
 * @param name Ім'я героя
 * @param type Тип героя (Warrior, Mage, Archer)
 * @returns Новий об'єкт героя
 */
function createHero(name: string, type: HeroType): Hero {
    let baseStats: HeroStats;

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
        name,
        type,
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
function determineAttackType(type: HeroType): AttackType {
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
function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const baseDamage = attacker.stats.attack - defender.stats.defense; // Базовий урон
    const damage = baseDamage > 0 ? baseDamage : 1; // Мінімальний урон = 1
    const isCritical = Math.random() < 0.2; // 20% шанс критичного удару

    const finalDamage = isCritical ? damage * 2 : damage;
    defender.stats.health -= finalDamage;

    // Оновлення статусу життя героя
    if (defender.stats.health <= 0) {
        defender.isAlive = false;
        defender.stats.health = 0;
    }

    return {
        damage: finalDamage,
        isCritical,
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
function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    for (const hero of heroes) {
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
function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return "Один з героїв вже мертвий!";
    }

    // Герой з вищою швидкістю атакує першим
    const firstAttacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
    const secondAttacker = firstAttacker === hero1 ? hero2 : hero1;

    const firstAttack = calculateDamage(firstAttacker, secondAttacker);
    let result = `${firstAttacker.name} атакує ${secondAttacker.name} і наносить ${firstAttack.damage} ${firstAttack.isCritical ? "(Критичний удар!)" : ""}. Залишок здоров'я: ${secondAttacker.stats.health}.\n`;

    if (!secondAttacker.isAlive) {
        result += `${secondAttacker.name} програв бій!`;
        return result;
    }

    const secondAttack = calculateDamage(secondAttacker, firstAttacker);
    result += `${secondAttacker.name} відповідає і наносить ${secondAttack.damage} ${secondAttack.isCritical ? "(Критичний удар!)" : ""}. Залишок здоров'я: ${firstAttacker.stats.health}.\n`;

    if (!firstAttacker.isAlive) {
        result += `${firstAttacker.name} програв бій!`;
    }

    return result;
}

// === Практичне застосування ===

// Масив героїв
const heroes: Hero[] = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леголас", HeroType.Archer)
];

// Пошук героя
const foundHero = findHeroByProperty(heroes, "type", HeroType.Mage);
console.log("Знайдений герой:", foundHero);

// Проведення бою
const battleResult = battleRound(heroes[0], heroes[1]);
console.log(battleResult);

// Додаткові раунди боїв
const secondBattle = battleRound(heroes[0], heroes[2]);
console.log(secondBattle);
