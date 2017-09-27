+++
title = "Variables"
date =  2017-09-26T13:13:15-03:00
weight = 5
+++

The var action allows you to store important values during the story. This values then can be display as text or dialogue and can be used to compare and form conditions.



### Asignation

To set the value of a variable we use the _var_ action. This kind of action is often called an asignation. An asignation is said to have two parts, _left_ and _rigth_, separated by a colon. The _left_ part has information about the variable being set, and in our case, also includes the name of the action. The _right_ part contains the value that will be set to that variable. This value can be of three types:

+ Number
+ Boolean
+ String

The _right_ part can therefore be text, a number or true|false. 

```yaml
    - var var1: number
    - var var2: true|false
    - var var3: text
```

### String variables

String variables are text, and can be combined with other variables to make more complex sentences. To use a value on the _right_ part you use the variable name surrounded by curly braces, i.e. _{varX}_.

```yaml
    - var name: Spike
    - var score: 10
    - var report: "Hi {name}, you have {score} points!"
```

### Show variables

Variables of any kind can be shown with _text_ or _say_ action, in the same way used to conform string variables.

```yaml
    - text: {report}
    - spike says: "What? Only {score} points? I though I was doing so well."
```

### Operations

The _right_ part can also be an operation whose result is any of the above mentioned types. These operations use special symbols depending on the type, and can use constant values and other variables. 

#### Arithmetic Operations

The first kind of operations are arithmetic: addition, substraction, etc. These operations should resolve to a numberic value.

The symbols used for these operations are:

+ **+** (Plus symbol): Means addition.
+ **-** (Dash symbol): Means substraction.
+ **\*** (Asterisck symbol): Means multiplication.
+ **/** (Slash symbol): Means division.

The operations also can use parenthesis () to change the solving order of the operation. As with normal arithmetic operations, multiplication and division have precedence over addition and substraction.


```yaml
    - var var1: 5
    - var var1: "{var1} + 1"
    - var var2: "{var1} * 6"
    - var var3: "({var1} - {var2})/3"
```

{{% notice warning %}}
The _right_ part should usually be between inverted commas. This is because the parser will sometimes freakout if if finds strange symbols. To ensure it reads the whole line as one, better to be safe and surround it by inverted commas.
{{% /notice %}}

#### Boolean Operations

Boolean operations should resolve to a _true_ or _false_ value. 

The symbols used for these operations are:

+ **&&** (AND): The operation will be true if both values between the AND are true.
+ **||** (OR): The operation will be true if either value between the OR is true.
+ **!** (NOT): The operation will be true if the value next to the NOT is false.

The operations can also use parenthesis () to change the solving order. As with normal logic operations, NOT has precedence over AND, who has precedence over OR.

```yaml
    - var var1: true
    - var var2: "!{var1}"
    - var var3: "{var1} && {var2}"
    - var var4: "!({var1} || {var2})"
```

Another way of getting a boolean value is by comparing numbers and numeric variables.
The symbols used for these operations are:

+ **>** (Greater than): The operation will be true if the left value is greater than the right value.
+ **>=** (Greater than or equal to): The operation will be true if the left value is greater than or equal to the right value.
+ **==** (Equal): The operation will be true if both values are equal.
+ **<=** (Less than or equal to): The operation will be true if the left value is less than or equal to the right value.
+ **<** (Less than): The operation will be true if the left value is less than the right value.

As with the previous operations, parenthesis () are allowed.

```yaml
    - var var1: 5
    - var var2: 7
    - var var3: "{var1} > {var2}"
    - var var4: "({var1}*2) > {var2}) && ({var2}-2 == {var2})"
```

String variables can also be compared in this way using the equal operator.