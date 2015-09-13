# Whistler's Motive

A work of interactive fiction for the [Javascript 13k Games Competition 2015](http://js13kgames.com).

[Play it.](https://mildmojo.github.io/whistler)

## Summary

You're living in a late-70s early-80s police state run by a government that's
heavily in bed with Bell-NYNEX. Post-Watergate, the telephony industry had an
outsized influence on the development of technology at the same time that the
government's fist learned to squeeze the people. The telco-state closed
Pandora's box on wireless, so the future's going to be wired for everyone from
military on down to Jane Smith.

You're a whistler; a phone phreak who can whistle perfectly-pitched tones that
command the signaling technologies of the era. You're out to stop an automated
artillery train heading to Portsmouth, NH to take out some fellow dissidents.
But first you have to catch it.

## Tech

The engine's kind of like Twine. In fact, the story was written inside Twine 2,
and I have a small loader that extracts the passages from a Twine 2 HTML file
into the simple name/body format my engine expects. Twine 2's empty HTML export
was something like 400KB. My empty build is closer to 5KB, or 4KB zipped.

The engine was inspired by the Snowman format but isn't quite a workalike. It
has the same `<% code %>` and `<%= value %>` inline code mechanisms and the same
`s` variable for game state inside passages. I have some custom macros
implemented to make some things easier, and I support running code as the target
of a link with `[[Description of link|js:call_some_code()]]` syntax. That part
plays hell with Twine's UI.

## Notes

This is less than what I wanted to produce. I got a late start on the
competition and wasn't able to put as much time toward it as I expected. I saw
the deadline, "13:00 CEST" and read it as "13:00 EST", so I lost six hours (!!)
that I expected to use to polish the story and add more interactive elements.
I was scrambling down to the last minute to get the story coherent and playable.
Not sure if it worked.

I'm not even sure if the entry will be accepted; I got delayed during submission
because I didn't have the required screenshots ready and the site kept telling
me my basic arithmetic was wrong.

Ping me on Twitter if you give it a try and you've got something to say.
