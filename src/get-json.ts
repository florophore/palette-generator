import {
  SchemaRoot,
  SchemaTypes,
  getReferencedObject,
  makeQueryRef,
} from "./floro-generator-schema-api";

export async function getJSON<T>(
  state: SchemaRoot,
): Promise<T> {
  const paletteJson: {
    [colorName: SchemaTypes["$(palette).colorPalettes.id<?>"]["id"]]: {
      [shadeName: SchemaTypes["$(palette).shades.id<?>"]["id"]]: string | null;
    };
  } = {};
  const colorPalettes = getReferencedObject(state, "$(palette).colorPalettes");
  const shades = getReferencedObject(state, "$(palette).shades");

  for (const colorPalette of colorPalettes) {
    paletteJson[colorPalette.id] = {};
    for (const shade of shades) {
      const shadeRef = makeQueryRef("$(palette).shades.id<?>", shade.id);
      const colorShade = getReferencedObject(
        state,
        `$(palette).colorPalettes.id<${colorPalette.id}>.colorShades.id<${shadeRef}>`
      );
      paletteJson[colorPalette.id][shade.id] = colorShade.hexcode ?? null;
    }
  }
  return paletteJson as T;
}