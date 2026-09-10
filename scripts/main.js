require("content/Units")
require("content/Drills")
require("content/Planets")
require("content/Blocks")
require("content/Turrets")

Events.on(ClientLoadEvent, () => {
    //Icon code from Psammos! Thank you andromeda
    loadIcon(61106, "masatomo-team-green") // \uEEB2

    function loadIcon(id, regionName) {
        let fonts = Seq.with(Fonts.def, Fonts.outline);
        let uitex = Core.atlas.find("logo").texture;
        let size = Math.floor(Fonts.def.getData().lineHeight / Fonts.def.getData().scaleY);

        let region = Core.atlas.find(regionName);

        if(region.texture != uitex) {
            return;
        };

        let out = Scaling.fit.apply(region.width, region.height, size, size);

        let glyph = new Font.Glyph();
        glyph.id = id;
        glyph.srcX = 0;
        glyph.srcY = 0;
        glyph.width = Math.floor(out.x);
        glyph.height = Math.floor(out.y);
        glyph.u = region.u;
        glyph.v = region.v2;
        glyph.u2 = region.u2;
        glyph.v2 = region.v;
        glyph.xoffset = 0;
        glyph.yoffset = -size;
        glyph.xadvance = size;
        glyph.kerning = null;
        glyph.fixedWidth = true;
        glyph.page = 0;
        fonts.each((f) => {
            f.getData().setGlyph(id, glyph);
        });
    };

    Team.green.emoji = "\uEEB2";
    Team.green.setPalette(
        Color.valueOf("54d67d"),
        Color.valueOf("41a453"),
        Color.valueOf("328250")
    )
})

