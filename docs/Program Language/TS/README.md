
# TypeScript 面试题

## 基础概念

### 1. 什么是TypeScript？

TypeScript是一种由微软开发的开源编程语言，它是JavaScript的超集。TypeScript通过添加静态类型、类、接口和模块等功能，使得在大型应用程序中更容易进行维护和扩展。它可以被编译为纯JavaScript，从而能够在任何支持JavaScript的地方运行。使用TypeScript可以帮助开发人员在编码过程中避免一些常见的错误，并提供更好的代码编辑功能和工具支持。

### 2. 体验TypeScript

TypeScript 提供了以下主要优势：

*   **静态类型检查**: 在编译时捕获错误，而不是在运行时。
*   **更好的代码可读性和可维护性**: 类型注解使代码更易于理解和重构。
*   **强大的工具支持**: 自动补全、代码导航和重构等功能。
*   **面向对象编程**: 支持类、接口和继承等面向对象特性。

### 3. 类型的两个好处

*   **减少错误**: 静态类型检查可以在开发阶段捕获许多常见的错误，例如拼写错误、类型不匹配等。
*   **提高代码质量**: 类型注解使代码更易于阅读、理解和维护，从而提高了代码的整体质量。

### 4. TS支持的JS类型

TypeScript 支持所有 JavaScript 的基本类型，包括：

*   `number`
*   `string`
*   `boolean`
*   `null`
*   `undefined`
*   `symbol`
*   `bigint`

### 5. TS中的any、unknown、void、never、enum、tuple

*   **`any`**: 表示任意类型。使用 `any` 会跳过类型检查，应谨慎使用。
*   **`unknown`**: 表示未知类型。比 `any` 更安全，因为在使用之前必须进行类型检查或类型断言。
*   **`void`**: 表示没有返回值的函数。
*   **`never`**: 表示永远不会有返回值的函数，例如抛出异常或无限循环的函数。
*   **`enum`**: 枚举类型，用于为一组数值常量赋予友好的名字。
*   **`tuple`**: 元组类型，允许表示一个已知元素数量和类型的数组。

### 6. 如何给不同数据加type

可以使用类型注解（`: type`）为变量、函数参数和函数返回值添加类型。

```typescript
let name: string = "Hidetoshi";
let age: number = 25;
let isStudent: boolean = true;

function greet(name: string): void {
    console.log("Hello, " + name);
}
```

### 7. 联合类型与区分联合类型

*   **联合类型 (Union Types)**: 使用 `|` 分隔符，表示一个值可以是几种类型之一。

    ```typescript
    let id: string | number;
    id = 101;
    id = "101";
    ```

*   **区分联合类型 (Discriminated Unions)**: 也称为标签联合类型或代数数据类型。它结合了联合类型和字面量类型，通过一个共同的属性来区分不同的类型。

    ```typescript
    interface Square {
        kind: "square";
        size: number;
    }

    interface Rectangle {
        kind: "rectangle";
        width: number;
        height: number;
    }

    type Shape = Square | Rectangle;

    function area(s: Shape) {
        switch (s.kind) {
            case "square": return s.size * s.size;
            case "rectangle": return s.width * s.height;
        }
    }
    ```

### 8. 交叉类型

交叉类型是将多个类型合并为一个类型。这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

```typescript
interface Person {
    name: string;
    age: number;
}

interface Employee {
    employeeId: string;
}

type EmployeeProfile = Person & Employee;

const employee: EmployeeProfile = {
    name: "Hidetoshi",
    age: 25,
    employeeId: "12345"
};
```

### 9. 怎么声明div的类型

可以使用 `HTMLDivElement` 类型来声明一个 `div` 元素。

```typescript
const myDiv: HTMLDivElement = document.getElementById('myDiv') as HTMLDivElement;
```

## 泛型

### 10. 泛型是什么？

泛型是一种创建可重用组件的方式，这些组件可以处理多种数据类型，而不仅仅是单一的数据类型。

### 11. 泛型的实际使用

泛型在创建可重用的函数、类和接口时非常有用。例如，我们可以创建一个泛型函数来反转任何类型的数组：

```typescript
function reverse<T>(items: T[]): T[] {
    return items.reverse();
}

const numbers = [1, 2, 3, 4, 5];
const reversedNumbers = reverse(numbers); // [5, 4, 3, 2, 1]

const strings = ["a", "b", "c"];
const reversedStrings = reverse(strings); // ["c", "b", "a"]
```

### 12. 重载

函数重载允许我们为同一个函数定义多个不同的签名。这使得我们可以根据传入的参数类型和数量来执行不同的操作。

```typescript
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
    return a + b;
}

const sum1 = add(1, 2); // 3
const sum2 = add("Hello", " World"); // "Hello World"
```

### 13. 如何用泛型封装网络请求库

我们可以使用泛型来创建一个可重用的网络请求库，该库可以处理不同类型的响应数据。

```typescript
interface ApiResponse<T> {
    data: T;
    status: number;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    const data = await response.json();
    return {
        data: data,
        status: response.status
    };
}

interface User {
    id: number;
    name: string;
}

async function getUser() {
    const response = await fetchData<User>('/api/user');
    const user = response.data;
    console.log(user.name);
}
```

## 其他

### 14. 枚举类型编译后

TypeScript 的枚举类型在编译后会生成一个对象，该对象包含枚举成员的名称和值。

```typescript
enum Color {
    Red,
    Green,
    Blue
}

// 编译后的 JavaScript 代码
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
```

### 15. interface继承的限制

*   一个接口可以继承多个接口。
*   接口只能继承接口，不能继承类。

### 16. unknown never any

1. `unknown` 表示未知类型。与 `any` 类型不同，`unknown` 类型的变量不能直接赋值给其他类型的变量，需要先进行类型检查或类型断言。
2. `never` 表示不存在的值的类型。通常在函数返回类型声明为 `never` 时，表示该函数永远不会正常返回。
3. `any` 表示任意类型。与 `unknown` 类型不同，`any` 类型的变量可以直接赋值给其他类型的变量，也可以调用任何函数和方法。使用 `any` 类型时，编译器将不会对变量类型进行检查，因此可能会导致类型不安全。尽量避免使用 `any` 类型，以提高代码的可读性和可维护性

### 17. interface type

1. `interface` 可以被合并，而 `type` 不能被合并。当多个同名的 `interface` 定义出现在同一个作用域中时，它们会自动合并成一个接口。
2. `type` 支持更多的类型操作符，例如 `|`、`&` 等。`type` 还支持使用类型操作符定义联合类型、交叉类型等复杂类型。
3. `interface` 支持定义类和函数的类型，而 `type` 不支持。`interface` 可以用于定义类的实例类型和函数的参数类型、返回值类型等。

## 更多面试题

### 1. 类型声明和类型推断的区别，并举例应用

类型声明是显式地为变量或函数指定类型，而类型推断是TypeScript根据赋值语句右侧的值自动推断变量的类型。例如：

```typescript
// 类型声明
let x: number;
x = 10;
// 类型推断
let y = 20; // TypeScript会自动推断y的类型为number
```

### 2. 什么是接口（interface），它的作用，接口的使用场景。接口和类型别名（Type Alias）的区别

接口是用于描述对象的形状的结构化类型。它定义了对象应该包含哪些属性和方法。在TypeScript中，接口可以用来约束对象的结构，以提高代码的可读性和维护性。例如：

```typescript
interface Person {
    name: string;
    age: number;
}

function greet(person: Person) {
    return `Hello, ${person.name}!`;
}
```

**接口和类型别名的区别：**

*   接口定义了一个契约，描述了对象的形状（属性和方法），以便在多个地方共享。它可以被类、对象和函数实现。
*   类型别名给一个类型起了一个新名字，便于在多处使用。它可以用于原始值、联合类型、交叉类型等。与接口不同，类型别名可以用于原始类型、联合类型、交叉类型等，而且还可以为任意类型指定名字。

### 3. 什么是泛型（generic），如何创建泛型函数和泛型类，实际用途

泛型是一种在定义函数、类或接口时使用类型参数的方式，以增加代码的灵活性和重用性。在TypeScript中，可以使用来创建泛型。例如：

```typescript
function identity<T>(arg: T): T {
    return arg;
}
// 调用泛型函数
let output = identity<string>("hello");
```

### 4. 枚举（enum）是什么，它的优势，应用案例。枚举和常量枚举的区别

枚举是一种对数字值集合进行命名的方式。它们可以增加代码的可读性，并提供一种便捷的方式来使用一组有意义的常量。例如：

```typescript
enum Color {
    Red,
    Green,
    Blue
}

let selectedColor: Color = Color.Red;
```

**枚举和常量枚举的区别:**

*   枚举可以包含计算得出的值，而常量枚举则在编译阶段被删除，并且不能包含计算得出的值，它只能包含常量成员。
*   常量枚举在编译后会被删除，而普通枚举会生成真实的对象。

### 5. 如何处理可空类型（nullable types）和undefined类型，如何正确处理这些类型以避免潜在错误

在TypeScript中，可空类型是指一个变量可以存储特定类型的值，也可以存储null或undefined。（通过使用可空类型，开发者可以明确表达一个变量可能包含特定类型的值，也可能不包含值（即为null或undefined）。这有助于提高代码的可读性，并使得变量的可能取值范围更加清晰明了）。
为了声明一个可空类型，可以使用联合类型（Union Types），例如 number | null 或 string | undefined。
例如：

```typescript
let numberOrNull: number | null = 10; 
numberOrNull = null; // 可以赋值为null 
    
let stringOrUndefined: string | undefined = "Hello"; 
stringOrUndefined = undefined; // 可以赋值为undefined
```

### 6. 什么是TypeScript中的声明文件（Declaration Files）

声明文件（通常以 .d.ts 扩展名结尾）用于描述已有 JavaScript 代码库的类型信息。它们提供了类型定义和元数据，以便在 TypeScript 项目中使用这些库时获得智能感知和类型安全。

### 7. 什么是命名空间（Namespace）和模块（Module）

*   **模块**: 在一个大型项目中，可以将相关的代码组织到单独的文件，并使用模块来导入和导出这些文件中的功能。在一个 Node.js 项目中，可以使用 `import` 和 `export` 关键字来创建模块，从而更好地组织代码并管理依赖关系。
*   **命名空间**: 在面向对象的编程中，命名空间可以用于将具有相似功能或属性的类、接口等进行分组，以避免全局命名冲突。这在大型的 JavaScript 或 TypeScript 应用程序中特别有用，可以确保代码结构清晰，并且不会意外地重复定义相同的名称。

模块提供了一种组织代码的方式，使得我们可以轻松地在多个文件中共享代码，命名空间则提供了一种在全局范围内组织代码的方式，防止命名冲突。

**模块示例:**

```typescript
// greeter.ts
export function sayHello(name: string) {
    return `Hello, ${name}!`;
}

// app.ts
import { sayHello } from './greeter';
console.log(sayHello('John'));
```

**命名空间示例:**

```typescript
// greeter.ts
namespace Greetings {
    export function sayHello(name: string) {
        return `Hello, ${name}!`;
    }
}

// app.ts
/// <reference path="greeter.ts" />
console.log(Greetings.sayHello('John'));
```

### 8. 什么是类型断言（Type Assertion）

类型断言允许程序员手动指定一个值的类型。这在需要明确告诉编译器某个值的类型时非常有用。

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 9. TypeScript中的可选参数和默认参数是什么

*   **可选参数** 允许函数中的某些参数不传值，在参数后面加上问号?表示可选。
*   **默认参数** 允许在声明函数时为参数指定默认值，这样如果调用时未提供参数值，则会使用默认值。

**可选参数示例：**

```typescript
function greet(name: string, greeting?: string) {
    if (greeting) {
        return `${greeting}, ${name}!`;
    } else {
        return `Hello, ${name}!`;
    }
}
```

**默认参数示例：**

```typescript
function greet(name: string, greeting: string = "Hello") {
    return `${greeting}, ${name}!`;
}
```

### 10. 类型守卫（Type Guards）是什么

类型守卫是一种用于在运行时检查类型的技术，它允许开发人员在特定的作用域内缩小变量的范围，以确保正确推断类型。

```typescript
function isString(test: any): test is string {
    return typeof test === "string";
}

function example(input: any) {
    if (isString(input)) {
        // input 在此代码块中被收窄为 string 类型
        console.log(input.toUpperCase());
    }
}
```

### 11. 索引类型（Index Types）是什么，好处有什么

索引类型允许我们在 TypeScript 中创建具有动态属性名称的对象，并且能够根据已知的键来获取相应的属性类型。

**好处：**

*   **动态属性访问**: 在处理动态属性名的对象时，可以使用索引类型来实现类型安全的属性访问。例如，当从服务器返回的 JSON 数据中提取属性时，可以利用索引类型来确保属性名存在并获取其对应的类型。
*   **代码重用**: 当需要创建通用函数来操作对象属性时，索引类型可以帮助我们实现更加通用和灵活的代码。例如，一个通用的函数可能需要根据传入的属性名称获取属性值，并进行特定的处理。
*   **动态扩展对象**: 当需要处理来自外部来源（比如 API 响应或数据库查询）的动态数据时，索引类型可以让我们轻松地处理这种情况，而不必为每个可能的属性手动定义类型。
*   **类型安全性**: 索引类型可以增强代码的类型安全性，因为它们可以捕获可能的属性名拼写错误或键不存在的情况。
*   **映射类型**: TypeScript 还提供了映射类型（Mapped Types）的概念，它们利用索引类型可以根据现有类型自动生成新类型。这在创建新类型时非常有用，特别是当需要在现有类型的基础上添加或修改属性时。

### 12. const和readonly的区别

*   **`const`**: 用于声明常量值。一旦被赋值后，其值将不能被重新赋值或修改。常量必须在声明时就被赋值，并且该值不可改变。常量通常用于存储不会发生变化的值，例如数学常数或固定的配置值。
*   **`readonly`**: 关键字用于标记类的属性，表明该属性只能在类的构造函数或声明时被赋值，并且不能再次被修改。`readonly` 属性可以在声明时或构造函数中被赋值，但之后不能再被修改。`readonly` 属性通常用于表示对象的某些属性是只读的，防止外部代码修改这些属性的值。

### 13. TypeScript 中 any 类型的作用是什么，滥用会有什么后果

在TypeScript中，`any` 类型的作用是允许我们在编写代码时不指定具体的类型，从而可以接受任何类型的值。使用 `any` 类型相当于放弃了对该值的静态类型检查，使得代码在编译阶段不会对这些值进行类型检查。

**滥用的后果：**

*   **代码可读性下降**: 难以理解某些变量或参数的具体类型。
*   **潜在的运行时错误**: 编译器无法捕获类型相关的错误。
*   **类型安全受损**: 失去了 TypeScript 强大的类型检查功能。

### 14. TypeScript中的this有什么需要注意的

在TypeScript中，与JavaScript相比，`this` 的行为基本上是一致的。然而，TypeScript提供了类型注解和类型检查，可以帮助开发者更容易地理解和处理 `this` 关键字的使用。

*   在 `noImplicitThis` 为 `true` 的情况下，必须声明 `this` 的类型，才能在函数或者对象中使用 `this`。
*   TypeScript中箭头函数的 `this` 和 ES6 中箭头函数中的 `this` 是一致的。

### 15. TypeScript数据类型

在TypeScript中，常见的数据类型包括以下几种：

*   **基本类型**: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
*   **复合类型**: `array`, `tuple`, `enum`
*   **对象类型**: `object`, `interface`
*   **函数类型**: `function`, `void`, `any`
*   **高级类型**: `union types`, `intersection types`

### 16. interface可以给Function/Array/Class（Indexable)做声明吗

在TypeScript中，`interface` 可以用来声明函数、数组和类（具有索引签名的类）。

### 17. TypeScript中的协变、逆变、双变和抗变是什么

*   **协变（Covariance）**: 子类型可以赋值给父类型。数组类型是协变的。
*   **逆变（Contravariance）**: 超类型可以赋值给子类型。函数参数类型是逆变的。
*   **双变（Bivariance）**: 允许参数类型既是协变又是逆变的。对象类型是双变的。
*   **抗变（Invariance）**: 不允许类型之间的任何赋值关系。通常情况下，基本类型和类类型是抗变的。

### 18. TypeScript中的静态类型和动态类型有什么区别

*   **静态类型**: 在编译期间进行类型检查，可以在编辑器或 IDE 中发现大部分类型错误。
*   **动态类型**: 在运行时才确定变量的类型，通常与动态语言相关联。

### 19. 介绍TypeScript中的可选属性、只读属性和类型断言

*   **可选属性**: 使用 `?` 来标记一个属性可以存在，也可以不存在。
*   **只读属性**: 使用 `readonly` 关键字来标记一个属性是只读的。
*   **类型断言**: 允许将一个实体强制指定为特定的类型，使用 `<Type>` 或 `value as Type`。

### 20. TypeScript 中的模块化是如何工作的，举例说明

TypeScript 中使用 ES6 模块系统，可以使用 `import` 和 `export` 关键字来导入和导出模块。

### 21. 如何约束泛型参数的类型范围

可以使用泛型约束（`extends`关键字）来限制泛型参数的类型范围，确保泛型参数符合某种特定的条件。

### 22. 什么是泛型约束中的 keyof 关键字，举例说明其用法。

`keyof` 是 TypeScript 中用来获取对象类型所有键（属性名）的操作符。可以使用 `keyof` 来定义泛型约束，限制泛型参数为某个对象的键。

### 23. 什么是条件类型（conditional types），能够举例说明其使用场景吗

条件类型是 TypeScript 中的高级类型操作符，可以根据一个类型关系判断结果类型。例如，可以使用条件类型实现一个类型过滤器，根据输入类型输出不同的结果类型。

### 24. 什么是装饰器，有什么作用，如何在TypeScript中使用类装饰器

装饰器是一种特殊类型的声明，可以附加到类、方法、访问符、属性或参数上，以修改其行为。在 TypeScript 中，装饰器提供了一种在声明时定义如何处理类的方法、属性或参数的机制。

### 25. 类装饰器和方法装饰器的执行顺序是怎样的

当有多个装饰器应用于同一个声明时（比如一个类中的方法），它们将按照自下而上的顺序应用。对于方法装饰器，从顶层方法开始依次向下 递归调用方法装饰器函数。

### 26. 装饰器工厂是什么，请给出一个装饰器工厂的使用示例

装饰器工厂是一个返回装饰器的函数。它可以接受参数，并根据参数动态生成装饰器。

## 参考资料

*   [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
*   [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
*   [两个月学前端能学完吗? - 知乎](https://www.zhihu.com/question/582777565/answer/2906665863)
*   [TypeScript面试题（2024最新版）](https://juejin.cn/post/7321542773076082699)
