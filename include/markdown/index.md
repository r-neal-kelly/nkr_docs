# Overview {#mainpage}

This library is in the early stages of development, but what better time to start end-user documentation?

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

    public:
        // it's important to define these in-body, which we need for a certain ctor condition
        class_t(const $class_t::integer_sp<integer_p>& other) :
            $class_t::integer_sp<integer_p>(other)
        {
        }

        class_t($class_t::integer_sp<integer_p>&& other) noexcept :
            $class_t::integer_sp<integer_p>(nkr::Move(other))
        {
        }
    };

    template <pointer_tr pointer_p>
    class class_t<pointer_p> :
        public $class_t::pointer_sp
    {
    public:
        using $class_t::pointer_sp<pointer_p>::pointer_sp;
        using $class_t::pointer_sp<pointer_p>::operator =;

    public:
        class_t(const $class_t::pointer_sp<pointer_p>& other) :
            $class_t::pointer_sp<pointer_p>(other)
        {
        }

        class_t($class_t::pointer_sp<pointer_p>&& other) noexcept :
            $class_t::pointer_sp<pointer_p>(nkr::Move(other))
        {
        }
    };

}
```

[Read about this on stackoverflow.](https://stackoverflow.com/questions/68589314/how-to-define-a-specialized-class-method-outside-of-class-body-in-c)
