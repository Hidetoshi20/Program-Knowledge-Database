# TypeScript questions d'entretien

## TypeScript 基础

### 1. 什么是TypeScript？

TypeScript是一种由微软开发的开源编程语言，它是JavaScript的超集。TypeScript通过添加静态类型、类、接口和模块等功能，使得在大型应用程序中更容易进行维护和扩展。它可以被编译为纯JavaScript，从而能够在任何支持JavaScript的地方运行。使用TypeScript可以帮助开发人员在编码过程中避免一些常见的错误，并提供更好的代码编辑功能和工具支持。

### 2. TypeScript的优势是什么?

*   **静态类型检查**: 在编译时捕获错误，而不是在运行时，提高了代码的健壮性。
*   **更好的代码可读性和可维护性**: 类型注解使代码意图更清晰，更易于理解和重构。
*   **强大的工具支持**: 自动补全、代码导航和重构等功能，提升开发效率。
*   **面向对象编程**: 支持类、接口和继承等面向对象特性。

### 3. 静态类型和动态类型的区别?

*   **静态类型**: 在 **编译期间** 进行类型检查。变量的类型在声明后是固定的。
*   **动态类型**: 在 **运行时** 才确定变量的类型。变量的类型可以随时改变。

## 核心类型

### 1. TS支持哪些JS类型?

TypeScript 支持所有 JavaScript 的基本类型，包括：`number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`，以及 `object`。

### 2. any, unknown, void, never, enum, tuple 各是什么？

*   **`any`**: 任意类型，完全跳过类型检查。应避免使用。
*   **`unknown`**: 未知类型。比 `any` 更安全，在使用前必须进行类型检查或类型断言来缩小范围。
*   **`void`**: 表示函数没有返回值。
*   **`never`**: 表示函数永远不会返回，例如抛出异常或无限循环的函数。
*   **`enum`**: 枚举类型，用于为一组数值常量赋予友好的名字。
*   **`tuple`**: 元组类型，允许表示一个已知元素数量和类型的数组。

### 3. `any` 类型的作用是什么，滥用会有什么后果？

`any` 类型的作用是允许我们在编写代码时不指定具体的类型，从而可以接受任何类型的值。使用 `any` 类型相当于放弃了对该值的静态类型检查。

**滥用的后果:**

*   **降低代码可读性**: 其他开发者难以理解变量的具体类型。
*   **潜在的运行时错误**: 编译器不会对 `any` 类型的值进行类型检查，可能导致在运行时出现 `TypeError`。
*   **类型安全受损**: 失去了 TypeScript 强大的类型检查功能。

因此，在实际开发中，应尽量避免过度使用 `any` 类型。

### 4. 如何处理可空类型 (nullable types)？

使用联合类型来显式声明一个变量可以为 `null` 或 `undefined`。配合严格空检查 (`strictNullChecks: true`)，可以强制开发者处理这些潜在的空值，避免运行时错误。

```typescript
let name: string | null = "Hidetoshi";
name = null; // OK
```

## 高级类型系统

### 1. 类型声明和类型推断的区别?

*   **类型声明**: 显式地为变量或函数指定类型。 `let x: number;`
*   **类型推断**: TypeScript根据赋值语句右侧的值自动推断变量的类型。 `let y = 20;` (y被推断为 `number`)

### 2. 联合类型 (Union Types) 与交叉类型 (Intersection Types)

*   **联合类型 (`|`)**: 表示一个值可以是多种类型中的一种。
*   **交叉类型 (`&`)**: 将多个类型合并为一个类型，它包含了所有类型的特性。

### 3. 接口 (interface) 和类型别名 (type) 的区别

*   **扩展性**: `interface` 可以通过 `extends` 来扩展，并且支持声明合并（多个同名 `interface` 会自动合并）。`type` 不支持声明合并，但可以通过交叉类型 (`&`) 来扩展。
*   **实现**: `class` 可以 `implements` 一个 `interface`，但不能 `implements` 一个 `type` (尽管可以实现 `type` 定义的结构)。
*   **复杂类型**: `type` 支持更复杂的操作，如联合类型、交叉类型、映射类型等。

### 4. 如何声明HTML元素的类型？

对于HTML元素，TypeScript 提供了内置的类型定义。例如，要声明一个 `div` 元素，可以使用 `HTMLDivElement` 类型。

```typescript
const myDiv: HTMLDivElement | null = document.querySelector('#myDiv');
```

### 5. 类型守卫 (Type Guards) 是什么？

类型守卫是一种在运行时检查类型的技术，它允许开发人员在特定的作用域内缩小变量的范围，以确保正确推断类型。常见的类型守卫有 `typeof`, `instanceof`, `in` 和自定义类型守卫函数。

```typescript
function isString(test: any): test is string {
    return typeof test === "string";
}
```

### 6. 什么是类型断言 (Type Assertion)？

类型断言允许程序员手动指定一个值的类型，告诉编译器“相信我，我知道这个值的类型”。它有两种语法：`<Type>value` 或 `value as Type`。

### 7. 索引类型 (Index Types) 和映射类型 (Mapped Types)

**索引类型 (Index Types)**

索引类型允许我们使用一个类型的键来查询另一个类型的属性。`keyof` 操作符是索引类型查询的核心，它可以获取一个类型的所有公共属性名的联合类型。

**`keyof` 操作符**

`keyof T` 会返回一个由 `T` 的所有公共属性名组成的字符串或数字字面量的联合类型。

```typescript
interface Person {
    name: string;
    age: number;
}

type PersonKeys = keyof Person; // "name" | "age"
```

**索引访问操作符 `[]`**

我们可以使用 `T[K]` 的语法来获取类型 `T` 的属性 `K` 的类型。

```typescript
type PersonNameType = Person["name"]; // string
```

**结合泛型使用**

索引类型最强大的地方在于和泛型结合使用，可以创建出类型安全的代码，用于处理对象的属性。

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

let person: Person = { name: "Hidetoshi", age: 25 };
let personName = getProperty(person, "name"); // string
let personAge = getProperty(person, "age"); // number
```

**映射类型 (Mapped Types)**

映射类型允许我们根据一个现有类型创建新类型，通过遍历现有类型的键来创建新类型的属性。这在创建现有类型的变体时非常有用，例如将所有属性变为只读或可选。

**基本语法**

`{ [P in K]: T }`

*   `K`: 一个字符串或数字字面量的联合类型。
*   `P in K`: 遍历 `K` 中的每一个键。
*   `T`: 新属性的类型。

**示例：创建只读类型**

TypeScript 内置的 `Readonly<T>` 工具类型就是一个很好的映射类型示例。

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

interface Person {
    name: string;
    age: number;
}

type ReadonlyPerson = Readonly<Person>;
/*
相当于:
type ReadonlyPerson = {
    readonly name: string;
    readonly age: number;
}
*/
```

**示例：创建可选类型**

TypeScript 内置的 `Partial<T>` 工具类型是另一个示例。

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type PartialPerson = Partial<Person>;
/*
相当于:
type PartialPerson = {
    name?: string;
    age?: number;
}
*/
```

**示例：创建选择性类型**

TypeScript 内置的 `Pick<T, K>` 工具类型允许我们从一个类型中选择一部分属性来创建新类型。

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type PersonNameOnly = Pick<Person, "name">;
/*
相当于:
type PersonNameOnly = {
    name: string;
}
*/
```

### 8. 条件类型 (Conditional Types) 是什么？

条件类型允许类型根据一个条件进行选择，语法为 `T extends U ? X : Y`。它使得类型可以像代码逻辑一样具有分支。

### 9. 协变、逆变、双变和抗变是什么？

这些概念描述了当类型A是类型B的子类型时，`Generic<A>` 和 `Generic<B>` 之间的关系。这在处理函数、数组等泛型类型时非常重要。

假设我们有以下基类和子类：

```typescript
class Animal {}
class Dog extends Animal { bark() {} }
```

**协变 (Covariance)**

如果 `Dog` 是 `Animal` 的子类型，那么 `Generic<Dog>` 也是 `Generic<Animal>` 的子类型。类型的子类型关系保持不变。

*   **场景**: 主要用于**只读**的位置，例如函数返回值或只读数组。
*   **示例**: TypeScript 中的数组（和元组）是协变的。如果你需要一个动物数组，那么提供一个狗数组是完全安全的，因为每只狗都是动物。

```typescript
// 协变示例
let dogs: Dog[] = [new Dog()];
let animals: Animal[] = dogs; // OK: Dog[] 是 Animal[] 的子类型
```

**逆变 (Contravariance)**

如果 `Dog` 是 `Animal` 的子类型，那么 `Generic<Animal>` 反而是 `Generic<Dog>` 的子类型。类型的子类型关系被**逆转**了。

*   **场景**: 主要用于**只写**的位置，最典型的就是函数参数。
*   **示例**: 如果一个函数能处理任何 `Animal`，那么它肯定能处理 `Dog`。因此，一个接受 `Animal` 类型参数的函数可以被赋值给一个要求接受 `Dog` 类型参数的函数变量。

```typescript
// 逆变示例
let processAnimal: (animal: Animal) => void = (animal) => { console.log("Processing an animal"); };
let processDog: (dog: Dog) => void = (dog) => { dog.bark(); };

// processAnimal = processDog; // 错误: 不能将一个更具体的函数赋值给一个更通用的函数变量
processDog = processAnimal;    // OK: 逆变。能处理所有动物的函数，当然也能处理狗。
```

**双变 (Bivariance)**

如果 `Dog` 是 `Animal` 的子类型，那么 `Generic<Dog>` 和 `Generic<Animal>` 可以互相赋值。既是协变又是逆变。

*   **场景**: 这是 TypeScript 为了灵活性在某些情况下采取的一种不完全类型安全的策略。在 `strictFunctionTypes: false` (默认是 `true`) 的情况下，函数参数是双变的。
*   **示例**: 在非严格函数类型模式下，上面逆变的例子中两个方向的赋值都会通过。

```typescript
// 双变示例 (需要设置 "strictFunctionTypes": false)
// let processAnimal: (animal: Animal) => void = (animal) => {};
// let processDog: (dog: Dog) => void = (dog) => {};

// processAnimal = processDog; // OK
// processDog = processAnimal;    // OK
```

**抗变 (Invariance)**

如果 `Dog` 是 `Animal` 的子类型，`Generic<Dog>` 和 `Generic<Animal>` 之间没有任何赋值关系。类型必须**完全匹配**。

*   **场景**: 主要用于**可读可写**的位置，因为同时支持读（协变）和写（逆变）会产生冲突，所以 TypeScript 强制类型必须完全一致来保证安全。
*   **示例**: 想象一个既可以设置也可以获取值的泛型接口。

```typescript
// 抗变示例
interface Invariant<T> {
  value: T;
  setValue: (value: T) => void;
}

let animalInvariant: Invariant<Animal> = { value: new Animal(), setValue: (val) => {} };
let dogInvariant: Invariant<Dog> = { value: new Dog(), setValue: (val) => {} };

// animalInvariant = dogInvariant; // 错误
// dogInvariant = animalInvariant; // 错误
```

## 泛型

### 1. 泛型是什么？

泛型是一种创建可重用组件的方式，这些组件可以处理多种数据类型，而不仅仅是单一的数据类型，从而增强了代码的灵活性和重用性。

### 2. 如何用泛型封装网络请求库？

我们可以使用泛型来创建一个可重用的网络请求函数，该函数可以处理任何类型的响应数据。

```typescript
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// 使用
interface User {
    id: number;
    name: string;
}

async function getUser() {
    const userResponse = await fetchData<User>('/api/user/1');
    console.log(userResponse.data.name);
}
```

### 3. 如何约束泛型参数的类型范围？

使用 `extends` 关键字来创建泛型约束。

```typescript
interface Lengthwise {
  length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property
  return arg;
}
```

### 4. `keyof` 在泛型约束中的用法？

`keyof` 可以获取一个对象类型的所有键，并与 `extends` 结合使用，以确保函数只能访问对象上存在的属性。

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

## 函数与类

### 1. 可选参数和默认参数是什么？

*   **可选参数 (`?`)**: 允许函数中的某些参数不传值。
*   **默认参数 (`=`)**: 为参数指定默认值，如果调用时未提供该参数，则使用默认值。

### 2. 函数重载

函数重载允许我们为同一个函数定义多个不同的签名，以根据不同的参数类型和数量提供不同的行为。

### 3. `const` 和 `readonly` 的区别

*   **`const`**: 用于声明一个常量 **变量**，其值不能被重新赋值。
*   **`readonly`**: 用于标记类的 **属性**，表明该属性只能在声明时或构造函数中被赋值。

### 4. `this` 在TypeScript中有什么需要注意的？

TypeScript 提供了更严格的 `this` 检查。可以使用 `noImplicitThis` 编译器选项来强制为 `this` 提供类型注解。箭头函数会捕获其定义时所在的上下文的 `this` 值。

### 5. `interface` 如何为函数、数组和类做声明？

*   **函数**: `interface MyFunc { (x: number, y: number): number; }`
*   **数组**: `interface StringArray { [index: number]: string; }`
*   **类 (索引签名)**: `interface StringDictionary { [index: string]: string; }`

### 6. interface继承的限制

一个接口可以继承多个接口，但如果继承的接口中有相同的属性但类型不兼容，则会产生编译错误。

## 模块与生态

### 1. 命名空间 (Namespace) 和模块 (Module) 的区别？

*   **模块**: 每个文件都是一个模块，有自己的作用域。使用 `import` 和 `export` 进行导入导出。这是现代JavaScript/TypeScript推荐的方式。
*   **命名空间**: 一个早期的组织代码的方式，用于避免全局命名冲突。现在主要用于大型应用或提供一个全局API。

### 2. 什么是声明文件 (Declaration Files)？

以 `.d.ts` 结尾的文件，用于为已有的JavaScript库提供类型信息，使得TypeScript项目可以安全地使用这些库。

### 3. 枚举类型编译后是什么？

一个标准的TypeScript枚举会编译成一个双向映射的JavaScript对象，同时包含数字到字符串和字符串到数字的映射。

### 4. 什么是装饰器 (Decorators)？

装饰器是一种特殊类型的声明，可以附加到类、方法、访问符、属性或参数上，以修改其行为。它是一种在声明时元编程的方式。

### 5. 类装饰器和方法装饰器的执行顺序是怎样的？

当有多个装饰器应用于同一个声明时，它们将按照自下而上的顺序应用。对于类中的方法，方法装饰器会先于类装饰器执行。

### 6. 什么是装饰器工厂？

装饰器工厂是一个返回装饰器的函数。它可以接受参数，并根据参数动态生成装饰器。

```typescript
function color(value: string) { // this is the decorator factory
  return function (target: any, propertyKey: string) { // this is the decorator
    // ...
  };
}
```

## 参考资料

*   [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
*   [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
*   [TypeScript questions d'entretien（2024最新版）](https://juejin.cn/post/7321542773076082699)