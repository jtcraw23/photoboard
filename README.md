# Photo Board

A phone page for archaeological field photography. Fill in the context (site,
unit, feature, level, photo type, facing, photographer, note), tap **Show
code**, and lay the phone on the photo board for the board shot. The QR code in
that photo carries the same information as the handwritten board, so the
desktop side (`board_reader.py` in the photo tools) can tag every photo that
follows it without anyone retyping the board.

The page holds no site data. Everything typed stays in the phone's browser
storage; nothing is sent anywhere. The page works with no signal once it has
been opened once.

## Install on a phone

Open the page address once while the phone has signal or wifi, then:

- **iPhone (Safari):** tap Share, then **Add to Home Screen**.
- **Android (Chrome):** open the menu, then **Install app** or **Add to Home
  screen**.

It now opens from its own icon and works in airplane mode. When the page is
updated, phones pick up the new version the next time they open it with signal.

## In the field

1. Fill in the form. Site and photographer are remembered; unit, feature and
   level offer the values used before.
2. Tap **Show code**. Turn the screen brightness up.
3. Lay the phone on the board, or hold it beside the board, and take the board
   shot as usual. Then take the photo series.
4. For the next photo of the same context, tap **Same context, next photo
   type**, change the type, and show the code again.

The **Log** tab lists every code shown on this phone and exports the list as a
CSV, which doubles as the day's photo log.

## Code format (version 1)

One line, pipe-delimited, byte mode, error correction M:

```
MVARCH1|<site>|<unit>|<feature>|<level>|<phototype>|<facing>|<YYYY-MM-DD>|<photographer>|<note>
```

Empty fields stay empty between the pipes. `MVARCH1` marks the format and its
version, so a reader can ignore any other QR code that appears in a photo. The
page strips `|` and line breaks from every field and trims the note so the
whole line stays under 200 characters.

## Files

- `index.html`: the whole page, with the QR generator (Kazuhiko Arase's
  `qrcode-generator`, MIT) inlined so nothing loads from the network.
- `sw.js`: service worker that caches the page for offline use. Bump `CACHE`
  when deploying a change.
- `manifest.webmanifest`, `icons/`: home-screen install metadata.
