# Overview {#mainpage}
This is my C++20 library which makes heavy usage of `concept` templates. The purpose of the library is primarily to exercise my abilities to create an extremely robust and well-defined system. Therefore every type should be critically tested and fully capable of fulfilling its purpose. Additionally, we're trying to avoid using the standard C++ library as an exercise in building the system from the ground-up and also to avoid the faults that come with the standard library.

This library avoids using exceptions and instead favors a much simpler yet still helpful error-code system. Firstly, there are few error-codes to speak of as the `assert` is the most commonly used error-prevention method. However for those errors that often go beyond the programmer's code, such as allocating memory, our error-codes provide a similar yet far-less intrusive and more efficient method of helping to remind the programmer to check for the potential error.

This library is in the early stages of development, but what better time to start end-user documentation? For this reason many parts of the library remain undocumented as I am still designing them.

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
There are a number of postfixes tacked unto labels to differentiate them from various kinds of data that work upon the same concept. For example, "example_t" is for "example type", "example_i" for "example interface", "example_tr" for "example trait", "example_err" for "example error", just to name a few. Because these all havae the same name except the postfix, it's implied that each of these different kinds of data relate and are interconnected.

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
