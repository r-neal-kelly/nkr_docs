# Designs {#Designs}

## The "One Kind of Template Parameter" Principle {#_ab449a60_e674_4d0a_91d9_557ec4c5660c}
A few key points need to be understood before expressing this principle:
    1. Templates can take an large variety of entities as parameters including types, other templates, and literal values.
    2. It is desirable to use templates as parameters in concepts.
    3. Templates can have any number of parameters and so parameter packs must be used in the concept.
    4. Parameter packs require one kind of template parameter and thus different entities cannot be mixed.

With these points in mind, it only makes sense to restrict each individual template to accept only one kind of template argument, whatever that may be. Doing so allows us to statically constrain the use of templates in our functions, types, interfaces, and more. For example, nkr::tr requires that every template used in an expression can only take types and nothing else.

---
