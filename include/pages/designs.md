# Designs

[nkr]:  @ref nkr

Many key concepts concerning design exist in [nkr][nkr], and their presence is felt all throughout the library. Their purposes involve the goals of memorization, scalability, performance, readability, and more. This page exists to argue the case for each design decision, to show how to take advantage of each pattern, and importantly, how to maintain that pattern when adding to the library.

Every single one of these designs has a non-trivial purpose and a lot of research and prototyping to back them up. A voluminous number of code examples exist per design and should be taken full advantage of in order to grasp why and how each pattern exists to specifically benefit you and your end-users. Every single piece of code is sampled from various test suites and thus is always up-to-date. Due to the length of these code examples, a table of contents located to your right is available for your convenience.

@tableofcontents

## Exception Avoidance {#_2cc5247e_75fb_4baa_91b3_b1be6ba6faff}
(W.I.P)

---

## Global Equality Operators {#_1f10466e_b496_498a_a930_6c7227b37371}

We define equality operators outside of the [nkr][nkr] namespace and in the global scope. We follow a **very specific pattern**. For `constexpr` types we write:

@snippet "./docs/src/designs.cpp" _e18507aa_b4f3_4469_b0a6_ff276fabf1b6

And for non-`constexpr` constructible types we merely drop the `constexpr` at the beginning of the declaration:

@snippet "./docs/src/designs.cpp" _fc99f829_b919_4aae_bdfb_b45b355c2614

Following the above pattern makes all equality operator overloads **templates**, and with that point in mind, this pattern avoids two very important conflicts:
1. Because the first template parameter, and *only* the first template parameter is constrained specifically to an `identity` and never a `generic`, **this pattern can *never* have ambiguous operator overload collisions with other operators that follow the same exact pattern**. This allows us to extend this pattern to all types ad infinitum, including types that inherit base types with their own overloads defined or types that can otherwise implicitly be converted to another.
2. Because all possible values are covered in the second parameter, including both lvalues and rvalues of any type whatsoever, **it is *impossible* for operator overload resolution to resolve to any implicit conversions from the second type**, in particular during reverse operator resolution - a potentially frustrating addition to the C++20 standard.

Following this pattern gives an extreme amount of flexibility for users. A user need not worry about the order of their arguments and whether including this or that file will somehow cause the compiler to spit out a thousand-line-long error message, resulting in a headache for the user every time it happens.

However, this comes at the cost of extra development effort. Every single type must define their own operator overloads explicitly. This means if you wish to use the overload of another type, you must define its operators and explicitly cast to that type. For this reason, the pattern was designed such that you only need to define one of the eight operators, and the rest can be easily defined as proxies.

The following is a full example of how one would define the operators for two different types, neither of which knows if the other is compatible. Both of them have an identifiable [primary inner type](@ref _8f6a1988_bbdb_46ba_8746_40c02acda41c), which adds options to their algorithms that otherwise might not be there:

@snippet "./docs/src/designs.cpp" _26b07298_7839_4099_9253_a58ba962aa0b

Now we can fully equate values of these two types in every imaginable way:

@snippet "./docs/src/designs.cpp" _4cb072ae_149f_4024_9145_7592e38ea63e

Because all of these operators are templates, even for non-`constexpr` subjects, `if constexpr` expressions can and should be used to define the algorithms. This allows the compiler to completely optimize away most if not all the function calls that result when equating values of these and other types that have these operators.

---

## Identities {#_749bceb9_9b02_4278_bd34_a8a83933e675}
[Identities](@ref _fd6e7324_a83c_4317_a5a8_9edfabfa7fce) are an integral part of the library because they provide an abstraction over functionality which necessarily needs multiple syntactical [entities](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) in order to be uniquely distinguished from other functionalities in the [meta-program](@ref _ef6a576b_26d1_4762_b577_3fe83cdee79f).

We call these distinct functionalities "identities" because each component entity that makes up an identity is integral to the identification of the [primary entity](@ref _75c3be6c_da45_4652_bf67_513fde1b9a06) of interest providing the functionality, such as a [type](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), a [template](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), or a [template template ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09).

In order to form an identity, we define the primary entity together with its various [identity traits](@ref _998fbcbf_ece6_455a_9f74_fda2b132fc39) and [identity tags](@ref _00c037ff_572b_4949_94ba_ced07fe26487). We take advantage of the [label postfix design](@ref _839025a7_339e_4e65_a259_5feacb45ea12) and utilize the same [base name](@ref _457a439d_2c16_48e4_9163_1e21aa6b2805) with different [postfixes](@ref _d28459df_56cd_4fe9_92a7_73c78f2f96f4) to strongly signify the relation of these entities to one another.

We'll begin by examining the identity trait and leave the identity tag for afterwards:
@snippet "./docs/src/designs.cpp" _54c5c7e1_91a3_4d5b_b41d_c158d3b4c573

Here we define the identity traits of a template called "a":
@snippet "./docs/src/designs.cpp" _fbae0c33_830c_4106_8c8d_bcbae9a82433

And lastly we define the identity traits of a template template called "a":
@snippet "./docs/src/designs.cpp" _7e0fe0cd_2eac_4f85_9539_4a1399492ab0

---

## Interface Specialization Indirection {#_3199146d_6573_4ada_8636_0e3a2607116a}
(W.I.P)

Because we are using C++20 concepts, we have to work around a bug that exists in two of the major compilers. In order to use out-of-body class definitions, we take advantage of a pattern of concept partial specialization which indirectly maps onto separate types. An alias of this indirection is used as the primary type. The actual types that make up the specializations should be put in a non-colliding namespace one step interior to the namespace where the primary type lives. No members in the indirection template may be defined out-of-body.

[View a small but detailed example of this bug.](https://github.com/r-neal-kelly/the_concept_bug)

---

## Label Postfixes {#_839025a7_339e_4e65_a259_5feacb45ea12}
There are a number of postfixes on various labels throughout the library. They are helpful in avoiding name collisions, in particular with C++ keywords, but primarily they are used to differentiate between different kinds of entities, such as types, traits, and interfaces.

@snippet "./docs/src/designs.cpp" _b516dddc_3630_470a_acf5_f070b2d4ffd1

You may have noticed that even the template parameter has a postifx, in particular `_p`. This allows for the easy definition of an alias with the same base name inside the template, a very frequent occurrence in [nkr][nkr]:

@snippet "./docs/src/designs.cpp" _d77d72c6_49d4_48d5_8799_655eef4bdebb

Importantly, postfixes can indicate strong relationships between several entities. It is extremely frequent to find these related entities declared nearby each other in the same file. This repetition of the primary name in combination with the repetition of the extremely common postfixes allows for easy recall when working with these entities. For example we may have the following:

@snippet "./docs/src/designs.cpp" _d4386f68_d330_40bb_8659_4d3d81ca6a2c

You may have noticed that template types share the same postfix as a regular type: `_t`. This is because the meaning of the postfix remains the same with `_t` referring to an `instantiated type`, which is the most frequent occurrence of a template type label:

@snippet "./docs/src/designs.cpp" _78f65ebc_ee89_4eb9_b7bf_eca7bf552002

You may have also noticed the distinction between `_tg` and `_ttg` as well as `_tr` and `_ttr`. While `_tg` and `_tr` may be read as `tag` and `trait` and both reference a `type`, `_ttg` and `_ttr` may be read as `template tag` and `template trait`, both referencing a `template`. More formally, they may be read as `template of type tag` and `template of type trait`. This pattern extends indefinitely, and may be used to define a `template of template of type tag` and `template of template of type trait`:

@snippet "./docs/src/designs.cpp" _4af78359_e062_45a4_b14c_f59533520b0b

nkr::tuple::templates_t is an example of this indefinite postfix pattern coming into play.

Postfixes even have a use in the naming of files, in particular header files. The most common postfixes come in a set of five, and like the various entities in the library proper, these postfixes are use to coordinate various files that have the same base name and imply a distinct relation to one another. They are in addition to the postfix of the primary entity contained in the files:

@snippet "./docs/src/designs.cpp" _dda6b4f4_9596_4713_8d31_f48990e0c898

The following is a comprehensive list of postfixes and their meanings as found throughout [nkr][nkr]:

### List of Label Postfixes {#_1382824d_0c2f_476c_b433_cf542fd6bdef}

- `_dec` declarations
- `_dec_def` declaration definitions
- `_def` definitions
- `_dox` documents or docs
- `_e` enumeration
- `_i` interface
- `_lb` label
- `_p` parameter
- `_t` type
- `_tg` tag
- `_tr` trait
- `_ttg` template tag
- `_ttr` template trait
- `_tttg` template template tag
- `_tttr` template template trait
- `_u` union

---

## Move Assignment of Volatile Instances {#_d720707b_2ea9_49b9_8625_8bca5b680359}
(W.I.P)

In order to avoid an overload resolution ambiguity, we use a template operator to define the move assignment of volatile types. Because templates have a lower precedence than normal operators, this allows for both volatile and non-volatile instances as well as new constructions of the type to be move-assigned properly, and also allows other types that can be converted through a constructor of the type to be properly assigned as expected:

@snippet "./docs/src/designs.cpp" _77c0f598_a0d0_44d9_be46_7751b857d956

---

## One Hierarchy {#_fb50a132_1997_4cb6_92b0_616254f27bae}
(W.I.P)

---

## One Kind of Template Parameter {#_ab449a60_e674_4d0a_91d9_557ec4c5660c}
A few key points need to be understood before expressing this principle:
    1. Templates can take an large variety of entities as parameters including types, other templates, and literal values.
    2. It is desirable to use templates as parameters in concepts.
    3. Templates can have any number of parameters and so parameter packs must be used in the concept.
    4. Parameter packs require one kind of template parameter and thus different entities cannot be mixed.

With these points in mind, it only makes sense to restrict each individual template to accept only one kind of template argument, whatever that may be. Doing so allows us to statically constrain the use of templates in our functions, types, interfaces, and more. For example, nkr::tr requires that every template used in an expression can only take types and nothing else.

---

## Primary Inner Type {#_8f6a1988_bbdb_46ba_8746_40c02acda41c}
Most every template type available in the library, regardless of how many parameters it has, contains a `primary inner type`. Usually, it's the first provided argument in the parameter list:

@snippet "./docs/src/designs.cpp" _71d0edc7_85b8_40e5_a79b_4d46a8ff2f08

Primary inner types are usually used for the sake of type constraints, particularly through use of an nkr::tr expression with multiple operands:

@snippet "./docs/src/designs.cpp" _6dffcb91_cf58_4490_9cd2_e39762bab3f0

It should be noted that each template does not need to have the same alias name for the `primary inner type`, nor does it need to reuse the parameter name in the name of its alias:

@snippet "./docs/src/designs.cpp" _61c79cda_e67d_4202_b6de_3f7078ba5f7b

So in order to know what the `primary inner type` is for a particular template instantiation, we need to use nkr::interface::type_i:

@snippet "./docs/src/designs.cpp" _7c1eacd8_f30a_4dd8_80e7_c4e02c2b88a2

Common alias names for a `primary inner type` are `type_t`, `value_t`, and `unit_t`.

---

## Qualification Support {#_a742d628_4b70_448e_bdc4_594f6954bdb2}
(W.I.P)

This library provides methods available for `non-qualified`, `const`, `volatile`, and `const volatile` qualifications of as many types as possible. Exceptions only occur when it doesn't make sense for a particular type to have a certain qualification, or for the aliased C++ types that do not define all qualifications.

---

## Type Documentation {#_5451462d_8ed6_4fc2_86f0_b2f98e5efdc6}
(W.I.P)
