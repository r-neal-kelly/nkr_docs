# Use-Cases

[nkr]:  @ref nkr

@brief
In-depth examples of how [nkr] can be put to use. If you are looking for short examples without prose, almost every entity has code samples in the [reference section](namespaces.html).

@tableofcontents

# nkr::tr

## Dynamically Define Concepts In-Place

Let's take a concrete example. What if we wanted to have a function that takes two `std::vectors` and combines them? We do not care what their `value_types` are, only that the second one has a `value_type` statically convertible to the other. Let's put together a simple algorithm and not worry about exceptions and other validations:

@snippet "./tr/src/tr.cpp" _1eb89575_6738_4a9f_970d_ec9694d4b9d7

It works as expected, but only when we give it valid inputs. So how can we take advantage of C++20 concepts to improve the user-experience? We ought to give them better compiler errors than this one:

@snippet "./tr/src/tr.cpp" _67458ff6_c7f5_46e6_b24e_24f4c565ab62

Actually, it might be tempting to change our algorithm so that `std::forward_list` will work too, but we want the algorithm that we have because it will be more performant with vectors and their `reserve` method. Maybe in the future we can add an overload for `std::forward_list` but for now we just want `std::vectors`. How about we try some duck-typing?:

@snippet "./tr/src/tr.cpp" _69e2f254_d945_4a7b_a8f1_09264cd66821

Works perfectly! Now the user cannot get a weird compiler message when they pass in a wrong type.

Right?:

@snippet "./tr/src/tr.cpp" _80ac1030_b280_42c4_9c4f_e70b43e05f11

We surely need to react better for our user. Even if it seems like an edge case, we can never be too sure what our users will do:

@snippet "./tr/src/tr.cpp" _33593243_fddd_4839_b95d_32f1ef8aba3b

Something more than duck-typing has to be done. We could add more method checks but the problem still remains, it cannot guarantee that our user will pass a `std::vector`. Well, there must a way to constrain to a `std::vector` without constraining to its `value_type`. Actually there's more than one way to do it:

@snippet "./tr/src/tr.cpp" _d244a6f8_6154_41f6_8a41_f8eba234289b

And here's a more concept-focused way:

@snippet "./tr/src/tr.cpp" _d87f347d_24a8_43f9_a87a_e0ec26b25bd6

As we can see they will both function correctly, but there's a couple of problems:

@snippet "./tr/src/tr.cpp" _f3feb95c_c2e0_47f9_9bbb_0ddae4e4de2e

While it's true that we want non-const `std::vectors` for our function, that is certainly not always going to be the case. Sometimes we actually want const and sometimes we may even want volatile types. Another issue is that it's not great having specific use-case concepts just laying about like this. In fact, it's really not great having concepts outside of our function at all. At the end of the day, we're not really interested in adding concepts to our code that will function in other contexts. We really just want our function to behave in a certain way. What we really want is to **dynamically define concepts in place**. Dynamic because we want to clarify qualification as well as type, and in place because we really just want it private to our particular function. And so we have nkr::tr:

@snippet "./tr/src/tr.cpp" _bdba9807_d875_4e5f_8b01_66662833310d

There's just one thing missing. Let's add another private and dynamically defined in-place concept within our function body, to make sure that the inner types of the `std::vectors` are convertible:

@snippet "./tr/src/tr.cpp" _9728b2d9_8986_46b7_b27b_a0d777cf2c90

As we have seen, by using nkr::tr we have cleanly and explicitly constrained our function as originally specified. Now we will truly only get non-const `std::vectors` passing through our function, all without having to statically define an exterior concept. We even use nkr::tr to ensure that their `value_types` are compatible. And in the future if we decide to support other types such as `std::forward_list` we can easily do so:

@snippet "./tr/src/tr.cpp" _0642efde_b645_4ca3_bb58_f094905d5c2e

And that's just scratching the surface of what nkr::tr is capable of. With advanced usage we can constrain to multiple types and templates, their inner `value_types`, duck-typed generics, and even full-fledged interfaces all within a single expression.

---

## Cleanly Negate Concepts

Let's say we have a container class with two overloads for an `Add` method, each of which accepts an element to add into our container. We have two overloads because we want the first one to copy lvalue references and the second one to move rvalue references. Because the lvalue reference overload has to make a copy, we allow any type that can be converted into an `element_t` through the method, but with the rvalue reference overload we want to keep the argument explicitly moveable so that our function can't turn into a potentially hidden and expensive operation:

@snippet "./tr/src/tr.cpp" _4d0e3bec_7bd6_4a17_ae41_691eb0d71080

But what happens if the user tries to move an instance that is not an `element_t`?

@snippet "./tr/src/tr.cpp" _891ccf29_a571_4cf2_b6d6_f4cb1596d13e

Without going into the specifics of why this happens, the important take-away here is that the user is not being told what went wrong and may very well think our class is broken. After all they are trying to *move* an object, but for some reason it's going to the *copy* overload instead. Furthermore a `long` can certainly be converted to a `long long` so maybe in the user's mind it should just work.

Now there is really only one way to fix this issue as it stands, and that is to add another overload that constrains to the opposite of what we want. We can then use the `delete` keyword to indicate that the new overload is unavailable, or we can define the overload with a static assert that explains to the user why it's not available. In either case, we have a problem. How do we logically negate our constraint?

@snippet "./tr/src/tr.cpp" _c7c83cab_5715_4153_b61b_7e2aa3ab2fe4

As we can see, the obvious solution does not work. We actually have to use a completely different syntax to negate the concept. Doing so will solve our original problem by producing a better compile-time error, but it will also introduce yet another user-oriented issue. Our API will become more complex with the introduction of a second syntax and less intuitive for our users to read:

@snippet "./tr/src/tr.cpp" _71f8326b_8eff_41d5_aaff_159d7b731959

Instead of using the different syntax, another option is to define a custom concept outside of the class:

@snippet "./tr/src/tr.cpp" _eb3e5c90_332f_44a4_9a2d_5c42bdc11403

Now in this simple case it might make sense to have a custom concept defined outside of the class because it can probably be used elsewhere. However, this pattern becomes burdensome for every concept we define. Does it really make sense to create an additional concept for every custom one we make, just because it could potentially be negated? For example, what if we want to change our custom concept to additionally constrain to non-const types? After all, if our container template accepts user-defined types as elements then we cannot move them when they are const:

@snippet "./tr/src/tr.cpp" _2e0e2f4b_2dca_45a9_9915_be7041b222f9

We really want a better solution than this. We're not interested in defining concepts that will be used in other contexts, we just want our class to behave a certain way so it's not confusing for our users. We also want our API to be easily readable, and maybe in the future we'll want to make adjustments to our method's constraints without worrying about breaking someone else's code. Enter nkr::tr:

@snippet "./tr/src/tr.cpp" _8e9ee60f_0c2c_4d3f_a843_84072362921b

So we see how nkr::tr gives us neater, more readable, and more robust constraints which can easily be negated.
