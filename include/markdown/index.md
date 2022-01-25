# Overview {#mainpage}
### General-Use Types
`nkr` exists to provide an assortment of well-rounded generic `types` offering fleshed-out functionality and interoperation through two primary meta-programming abstractions: `traits` and `interfaces`:
- `traits` are concepts that essentially act as the nouns for types and are divided into two general sub-categories:
  - `identities`
    - these constrain to any instantiation of a particular template type or to a non-template type. In either case, they may be const, volatile, const volatile, or non-qualified. If the type is a template, a sibling identity exists to constrain the template itself, making the template a first class citizen in the library.
  - `generics`
    - these constrain to multiple `identities` and are also hierarchically allowed to constrain to other `generics`. They are used to describe groups of `identities` both in a meaningful and a practical way. For example a `generic` may constrain to any array, or perhaps to any array that stores its data locally, or alternatively, to any array that stores its data remotely. Any `identity` that satisfies these `generics` necessarily satisfies their requirements, and in this case that would include the access operator. In this way, templated code may reliably work with any of these constrained arrays by accessing their elements.
- `interfaces` are concepts that essentially act as verbs for `types` and `traits` by specifying how they may do something. They describe not what a type is, but what it can do. A great example of an interface is for the `nkr::none::value_t`. Whereas a `trait` may require that a type have a default constructor to provide a value that may or may not be equal to `none`, an `interface` only requires a soft-coupling to define what the `none` value is for a particular `identity`, whether it is has a default constructor or not, or if it does but the default value is not equal to `none`.

### Full Qualifications
As much as possible, this library provides methods available for `const`, `volatile`, and `const volatile` qualifications of types, in addition to the the standard non-qualification. The only exceptions are for when it doesn't make sense for a particular type to have a certain qualification, or if we are currently using a C++ type in some way, which often does not define `const` and `volatile` qualifications.

# Design

### Data Labels
There are a number of postfixes tacked unto labels to differentiate them from various kinds of syntactic data. For example, "example_t" is for "example type", "example_i" for "example interface", "example_tr" for "example trait", "example_tg" for "example tag", just to name a few. This helps to secure an open namespace for new labels to be added in the future, even if they are in the same namespace and have the same base name.

### File Hierarchy
Files mimic the hierarchy of the library's namespaces and include the postfix of whatever it is they are primarily declaring or defining. For example, types have "_t" in the name of the file, such as in "example_t", and interfaces have "_i" in the name of the file, such as in "example_i". This gives as much room to avoid collisions as there is in the general namespace and leaves open more general files such as "example" where they are needed. In addition, post-postfixes are added to files that make them distinct based on their function in the include system. For example, "example_t_dec.h" is for "example_t declaration" and "example_t_def.h" for "example_t definition". Additionally, there is a primary header for each group of sub-headers that does not include a post-postfix. This file allows for a consumer of the library to easily pull in everything they need for that entity, with every file already included in order.

### Equality Operators are Globals
For the sake of compatibility and control we define equality operators for types using a specific and exhaustive pattern all in the top global scope:

```cpp
constexpr nkr::boolean::cpp_t   operator ==(const nkr::tr1<nkr::any_tg, nkr::example_t> auto& a, const auto& b) noexcept;
constexpr nkr::boolean::cpp_t   operator ==(const nkr::tr1<nkr::any_tg, nkr::example_t> auto& a, const auto&& b) noexcept;
constexpr nkr::boolean::cpp_t   operator ==(const nkr::tr1<nkr::any_tg, nkr::example_t> auto&& a, const auto& b) noexcept;
constexpr nkr::boolean::cpp_t   operator ==(const nkr::tr1<nkr::any_tg, nkr::example_t> auto&& a, const auto&& b) noexcept;

constexpr nkr::boolean::cpp_t   operator !=(const nkr::tr1<nkr::any_tg, nkr::example_t> auto& a, const auto& b) noexcept;
constexpr nkr::boolean::cpp_t   operator !=(const nkr::tr1<nkr::any_tg, nkr::example_t> auto& a, const auto&& b) noexcept;
constexpr nkr::boolean::cpp_t   operator !=(const nkr::tr1<nkr::any_tg, nkr::example_t> auto&& a, const auto& b) noexcept;
constexpr nkr::boolean::cpp_t   operator !=(const nkr::tr1<nkr::any_tg, nkr::example_t> auto&& a, const auto&& b) noexcept;
```

Because the left hand parameter is a templated type, it prevents a potentially confusing new feature of C++20 that automatically tries reversing arguments for standard operators, which can lead to a lot of compatibility issues and ambiguities with other types defining equality operators. Notice that the b parameter is always const, even for rvalue references. This gives an extreme amount of flexibility while maintaining as much clarity as possible. Notice also that we define no reverse versions of these operators. This allows us to define these same set of functions per type and to give them proper definitions where applicable, all without causing collisions and ambiguities. We make up for any lack of reverse definitions by allowing any type whatsoever to attempt comparison in the general algorithm below:

```cpp
inline constexpr nkr::boolean::cpp_t
    operator ==(const nkr::tr1<nkr::any_tg, nkr::example_t> auto& a, const auto& b)
    noexcept
{
    using a_t = nkr::cpp::reference_value_t<decltype(a)>;
    using b_t = nkr::cpp::reference_value_t<decltype(b)>;

    if constexpr (nkr::cpp::is_any_tr<b_t, a_t>) {
        // works with any qualified version of the same type by comparing their inner values.
        return a() == b();
    } else if constexpr (nkr::cpp::to_tr<b_t, nkr::cpp::just_non_qualified_t<typename a_t::value_t>>) {
        // only applicable if a_t has an inner type, in this case value_t. there can be any number of these specific to this type.
        return a() == static_cast<nkr::cpp::just_non_qualified_t<typename a_t::value_t>>(b);
    } else if constexpr (nkr::cpp::to_tr<b_t, nkr::cpp::just_non_qualified_t<a_t>>) {
        // tries to convert b_t to a_t and recurses back to this operator.
        return a == static_cast<nkr::cpp::just_non_qualified_t<a_t>>(b);
    } else if constexpr (nkr::cpp::to_tr<a_t, nkr::cpp::just_non_qualified_t<b_t>>) {
        // tries to convert a_t to b_t and compares with b's algorithm.
        return static_cast<nkr::cpp::just_non_qualified_t<b_t>>(a) == b;
    } else {
        static_assert(false, "these two values can not be compared.");
    }
}
```

This is the only equality operator in the group of declarations above that has such a definition, as the rest simply convert their arguments and/or complement their logic to call this one.

### Move Assignment of Volatile Types
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

### Partial Specializations By Concept {#_16d56f49_95ba_456e_a026_706c054cb133}
Because we are using C++20 concepts, we have to work around a bug that exists in two of the major compilers. In order to use out-of-body class definitions, we take advantage of a pattern of concept partial specialization which indirectly maps onto separate types. An alias of this indirection is used as the primary type. The actual types that make up the specializations should be put in a non-colliding namespace one step interior to the namespace where the primary type lives. No members in the indirection template may be defined out-of-body:

```cpp
namespace nkr { namespace $example_t {

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
        using type_t    = $example_t::integer_sp<value_p>;
    }

    template <pointer_tr value_p>
    class example_t_sp
    {
    public:
        using type_t    = $example_t::pointer_sp<value_p>;
    }

    template <typename value_p>
    using example_t = example_t_sp<value_p>::type_t;

}
```
[View a small but detailed example of this bug.](https://github.com/r-neal-kelly/the_concept_bug)

[Read about it on stackoverflow.](https://stackoverflow.com/questions/68589314/how-to-define-a-specialized-class-method-outside-of-class-body-in-c)

## Documentation Status
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
