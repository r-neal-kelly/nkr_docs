# Overview {#mainpage}
### Why nkr?
`nkr` exists to provide an assortment of well-rounded generic `types` offering fleshed-out functionality and interoperation through two primary meta-programming abstractions: `traits` and `interfaces`:
- `traits` are concepts that essentially act as the nouns and are divided into two general sub-categories:
  - `identities`
    - these constrain to any instantiation of a particular template type or to a non-template type. In either case, they may be const, volatile, const volatile, or non-qualified. If the type is a template, a sibling identity exists to constrain the template itself, making the template a first class citizen in the library.
  - `generics`
    - these constrain to multiple `identities` and are also hierarchically allowed to constrain to other `generics`. They are used to describe groups of `identities` both in a meaningful and a practical way. For example a `generic` may constrain to any array, or perhaps to any array that stores its data locally, or alternatively, to any array that stores its data remotely. Any `identity` that satisfies these `generics` necessarily satisfies their requirements, and in this case that would include the access operator. In this way, templated code may reliably work with any of these constrained arrays, such as by accessing their elements.
- `interfaces` are concepts that essentially act as verbs for `types` and `traits` by specifying how they may do something. They describe not what a type is, but what it can do. A great example of an interface is for the `nkr::none::value_t`. Instead of arbitrarily requiring some hard coupling such as a default constructor, `interfaces` allow the user to define what the none value is for their particular `identity`, whether they have a default constructor or not.

### Documentation Status
We are in the pre-alpha phase of the library. We are currently prototyping and designing the overarching system of types, traits, and interfaces, and importantly, we are designing the documentation itself. Currently we are implementing the third iteration of traits and interfaces across the library which in addition to improving accessibility and performance, also addresses a consistency issue with the previous two iterations. In the meantime, the documentation remains focused on the old versions, but after we finish this latest iteration we will be updating this documentation to not only reflect the new types as well as the old, but also to give particular focus to the new traits and interfaces that describe the system as a whole. Until that time, anything following in the documentation refers to code that has either been moved or is in the process of being moved to the new system. Thank you for your understanding.

#### Basics
- nkr::bool_t
- nkr::pointer_t
- nkr::atomic_t

#### Maybes
- nkr::none_i
- nkr::none_t
- nkr::maybe_i
- nkr::maybe_t
- nkr::some_i
- nkr::some_t

#### Allocators
- nkr::allocator_i
- nkr::allocator::heap_t
- nkr::allocator::heap_zeros_t

#### Arrays
- nkr::array_i
- nkr::array::dynamic_t
- nkr::array::instant_t
- nkr::array::stack_t

#### Charcoders
- nkr::charcoder_i
- nkr::charcoder::ascii_t
- nkr::charcoder::utf_8_t
- nkr::charcoder::utf_16_t
- nkr::charcoder::utf_32_t

#### Enumerations
- nkr::enumeration::flags_t
- nkr::enumeration::types_t
- nkr::enumeration::errors_t

#### Numbers
- nkr::signed_negative_t
- nkr::signed_positive_t

#### Strings
- nkr::string::dynamic_t
- nkr::string::static_t

#### Namespaced Functions
- nkr::math
- nkr::os

#### Global nkr Definitions
- fors.h
- intrinsics.h
- macros.h
- traits.h
- utils.h

# Designs

## Data Labels
There are a number of postfixes tacked unto labels to differentiate them from various kinds of data that work upon the same concept. For example, "example_t" is for "example type", "example_i" for "example interface", "example_tr" for "example trait", "example_err" for "example error", just to name a few. Because these all have the same name excepting the postfix, it's implied that each of these different kinds of data relate and are interconnected, all at a glance.

## File Hierarchy
Files include the postfix of whatever it is they declare or define. For example, types have "_t" in the name of the file: e.g. "pointer_t.h", "bool_t.cpp". This is to make them distinct from other kinds of data that have the same name but a different postfix. In addition, post-postfixes are added to the names of files to make them distinct from the kinds of files that make up the program, e.g. "pointer_t_dec.h" for "pointer_t declaration" and "bool_t_def.h" for "bool_t definition". There is yet another that is used to decouple comments from the code, e.g. "pointer_t_dox.h" for "pointer_t documents".

## Templates
This is pretty much a template library. Therefore this library sacrifices compilation speed for runtime speed. For that reason, I have begun implementing the option to pre-define common templated types if you find you should need them in your project. However any project that is 100,000 or so lines long should not have any significant slow-downs. Getting into the millions is much harder to speak about, but knowing C++ and its slow compilation speeds, it's probably not going to be great compilation times. However, take note that the ridiculously slow parts of the meta-language are not typically not used, especially things like iterating tuples. Very rarely is there any meta-recursion (or recursion generally) however the examples of recursion that do exist are opt-in and completely avoidable. (See nkr::array::stack_t and its Push methods.)

## Full Definitions
As much as possible, one of my goals for this library is to create complete types as much as possible. Therefore almost every type has all sensible methods available for `const`, `volatile`, and `const volatile` versions of the type, in addition to the the unqualified variety.

## Class Concept Specializations {#_16d56f49_95ba_456e_a026_706c054cb133}
Because we are using the C++20 concepts feature, which is not fully implemented in all compilers, we do have to work around a couple of bugs that currently exist in two of the big compilers to varying degrees. In order to use out-of-body class definitions, we use a pattern of concept specialization that has the specializations inherit all of their members from a different class, including methods, ctors, dtor, and assignment operators. This effectively makes the specialization the same class as the base. We put these in a name space one step interior to the namespace where the type lives, and it's named after the type with an additional "$" prefixing it. We also put no members in the default class and only use the specializations. This is to avoid yet another bug that currently exists in one of the big compilers:

```cpp
namespace nkr { namespace $class_t {

    template <integer_tr integer_p>
    class integer_sp
    {
        // has any member you want
    }

    template <pointer_tr pointer_p>
    class pointer_sp
    {
        // has any member you want
    }

}}

namespace nkr {

    template <typename invalid_p>
    class class_t
    {
        // has no members, and we usually delete all ctors and dtor explicitly.
        // else it can inherit a default specialization in the sub-namespace.
    }

    template <integer_tr integer_p>
    class class_t<integer_p> :
        public $class_t::integer_sp
    {
    public:
        using $class_t::integer_sp<integer_p>::integer_sp;
        using $class_t::integer_sp<integer_p>::operator =;
    };

    template <pointer_tr pointer_p>
    class class_t<pointer_p> :
        public $class_t::pointer_sp
    {
    public:
        using $class_t::pointer_sp<pointer_p>::pointer_sp;
        using $class_t::pointer_sp<pointer_p>::operator =;
    };

}
```

[Read about this on stackoverflow.](https://stackoverflow.com/questions/68589314/how-to-define-a-specialized-class-method-outside-of-class-body-in-c)
