# Designs
This page contains many key concepts revolving around design decisions that have been made with [nkr](@ref nkr). Each section thoroughly explains why these designs exist and how best to take advantage of them.

*Contents*
- [Label Postfixes](@ref _839025a7_339e_4e65_a259_5feacb45ea12)
  - [List of Label Postfixes](@ref _1382824d_0c2f_476c_b433_cf542fd6bdef)
- [Primary Inner Type](@ref _8f6a1988_bbdb_46ba_8746_40c02acda41c)
- [One Kind of Template Parameter](@ref _ab449a60_e674_4d0a_91d9_557ec4c5660c)

---

## Label Postfixes {#_839025a7_339e_4e65_a259_5feacb45ea12}
There are a number of postfixes on various labels throughout the library. They are helpful in avoiding name collisions, in particular with C++ keywords, but primarily they are used to differentiate between different kinds of entities, such as types, traits, and interfaces.

@snippet "./docs/src/designs.cpp" _b516dddc_3630_470a_acf5_f070b2d4ffd1

You may have noticed that even the template parameter has a postifx, in particular `_p`. This allows for the easy definition of an alias with the same base name inside the template, a very frequent occurrence in @ref nkr:

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

The following is a comprehensive list of postfixes and their meanings as found throughout @ref nkr:

### List of Label Postfixes {#_1382824d_0c2f_476c_b433_cf542fd6bdef}

- `_dec` declarations
- `_dec_def` declaration definitions
- `_def` definitions
- `_dox` documents or docs
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

## The "One Kind of Template Parameter" Principle {#_ab449a60_e674_4d0a_91d9_557ec4c5660c}
A few key points need to be understood before expressing this principle:
    1. Templates can take an large variety of entities as parameters including types, other templates, and literal values.
    2. It is desirable to use templates as parameters in concepts.
    3. Templates can have any number of parameters and so parameter packs must be used in the concept.
    4. Parameter packs require one kind of template parameter and thus different entities cannot be mixed.

With these points in mind, it only makes sense to restrict each individual template to accept only one kind of template argument, whatever that may be. Doing so allows us to statically constrain the use of templates in our functions, types, interfaces, and more. For example, nkr::tr requires that every template used in an expression can only take types and nothing else.
