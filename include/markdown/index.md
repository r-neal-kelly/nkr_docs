# nkr {#mainpage}

# Overview

## General-Use Types
`nkr` exists to provide an assortment of well-rounded generic `types` offering fleshed-out functionality and interoperation through two primary meta-programming abstractions: `traits` and `interfaces`:
- `traits` are concepts that essentially act as the nouns for types and are divided into two general sub-categories:
  - `identities`
    - these constrain to any instantiation of a particular template type or to a non-template type. In either case, they may be const, volatile, const volatile, or non-qualified. If the type is a template, a sibling identity exists to constrain the template itself, making the template a first class citizen in the library.
  - `generics`
    - these constrain to multiple `identities` and are also hierarchically allowed to constrain to other `generics`. They are used to describe groups of `identities` both in a meaningful and a practical way. For example a `generic` may constrain to any array, or perhaps to any array that stores its data locally, or alternatively, to any array that stores its data remotely. Any `identity` that satisfies these `generics` necessarily satisfies their requirements, and in this case that would include the access operator. In this way, templated code may reliably work with any of these constrained arrays by accessing their elements.
- `interfaces` are concepts that essentially act as verbs for `types` and `traits` by specifying how they may do something. They describe not what a type is, but what it can do. A great example of an interface is for the `nkr::none::value_t`. Whereas a `trait` may require that a type have a default constructor to provide a value that may or may not be equal to `none`, an `interface` only requires a soft-coupling to define what the `none` value is for a particular `identity`, whether it is has a default constructor or not, or if it does but the default value is not equal to `none`.

For more information, please see nkr::tr<> and nkr::TR<>.

## Full Qualifications
As much as possible, this library provides methods available for `const`, `volatile`, and `const volatile` qualifications of types, in addition to the the standard non-qualification. The only exceptions are for when it doesn't make sense for a particular type to have a certain qualification, or if we are currently using a C++ type in some way, which often does not define `const` and `volatile` qualifications.

---

# Design

These design topics are currently being moved to the [designs page](designs.md) which has far more coverage and in depth explanations.

## Move Assignment of Volatile Types
In order to avoid an overload resolution ambiguity, we often use a templated operator to define the move assignment of volatile types. Because templates have a lower precedence than normal operators, this allows for both volatile and non-volatile instances as well as new constructions of the type to be move-assigned properly, and also allows other types that can be converted through a constructor of the type to be properly assigned as expected.

```cpp
class example_t
{
public:
    example_t&            operator =(const example_t& other);
    volatile example_t&   operator =(const example_t& other) volatile;
    example_t&            operator =(const volatile example_t& other);
    volatile example_t&   operator =(const volatile example_t& other) volatile;
    example_t&            operator =(example_t&& other);                                        // may match any rvalue that is or can be converted implicitly to an example_t
    volatile example_t&   operator =(example_t&& other) volatile;                               // ""
    example_t&            operator =(tr1<just_volatile_tg, example_t> auto&& other);            // only ever resolves if given a volatile example_t&&
    volatile example_t&   operator =(tr1<just_volatile_tg, example_t> auto&& other) volatile;   // ""
}
```

## Partial Specializations By Concept {#_16d56f49_95ba_456e_a026_706c054cb133}
Because we are using C++20 concepts, we have to work around a bug that exists in two of the major compilers. In order to use out-of-body class definitions, we take advantage of a pattern of concept partial specialization which indirectly maps onto separate types. An alias of this indirection is used as the primary type. The actual types that make up the specializations should be put in a non-colliding namespace one step interior to the namespace where the primary type lives. No members in the indirection template may be defined out-of-body:

```cpp
namespace nkr { namespace example_t$ {

    template <integer_tr value_p>
    class integer_sp
    {
        // has any member you want, and they can all be defined out-of-body
    }

    template <pointer_tr value_p>
    class pointer_sp
    {
        // ""
    }

}}

namespace nkr {

    template <typename value_p>
    class example_t_sp;

    template <integer_tr value_p>
    class example_t_sp
    {
    public:
        using type_t    = example_t$::integer_sp<value_p>;
    }

    template <pointer_tr value_p>
    class example_t_sp
    {
    public:
        using type_t    = example_t$::pointer_sp<value_p>;
    }

    template <typename value_p>
    using example_t = example_t_sp<value_p>::type_t;

}
```
[View a small but detailed example of this bug.](https://github.com/r-neal-kelly/the_concept_bug)

[Read about it on stackoverflow.](https://stackoverflow.com/questions/68589314/how-to-define-a-specialized-class-method-outside-of-class-body-in-c)

---

# Documentation Status

We are in the pre-alpha phase of the library. We are currently prototyping and designing the overarching system of types, traits, and interfaces, and importantly, we are still designing the documentation itself. I've removed all of the old documentation from the previous iteration and have begun writing for the third.
