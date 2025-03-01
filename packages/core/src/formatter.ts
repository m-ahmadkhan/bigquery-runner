import * as CSV from "csv-stringify";
import EasyTable from "easy-table";
import { Struct } from "types";
import { Flat } from "./flat";

export type Formatter = {
  readonly type: "table" | "markdown" | "json-lines" | "json" | "csv";
  readonly header: (props: { flat: Flat }) => string;
  readonly rows: (props: {
    flat: Flat;
    structs: Array<Struct>;
    rowNumberStart: bigint;
  }) => Promise<string>;
  readonly footer: () => string;
};

export function createTableFormatter(): Formatter {
  return {
    type: "table",
    header() {
      return "";
    },
    async rows({ flat, structs, rowNumberStart }) {
      const t = new EasyTable();
      flat.toRows({ structs, rowNumberStart }).forEach(({ rows }) => {
        rows.forEach((row) => {
          row.forEach((cell) => t.cell(cell.id, cell.value));
          t.newRow();
        });
      });
      return t.toString().trimEnd() + "\n";
    },
    footer() {
      return "";
    },
  };
}

export function createMarkdownFormatter(): Formatter {
  return {
    type: "markdown",
    header({ flat }) {
      if (flat.heads.length === 0) {
        return "";
      }
      return `|${flat.heads.map(({ id }) => id).join("|")}|
|${flat.heads.map(() => "---").join("|")}|
`;
    },
    async rows({ flat, structs, rowNumberStart }) {
      return (
        flat
          .toRows({ structs, rowNumberStart })
          .flatMap(({ rows }) =>
            rows.map(
              (row) =>
                `|${row
                  .map(({ value }) =>
                    value === undefined
                      ? ""
                      : typeof value === "string"
                      ? value.replace(/\n/g, "<br/>")
                      : `${value}`
                  )
                  .join("|")}|`
            )
          )
          .join("\n") + "\n"
      );
    },
    footer() {
      return "";
    },
  };
}

export function createJSONLinesFormatter(): Formatter {
  return {
    type: "json-lines",
    header() {
      return "";
    },
    async rows({ structs }) {
      return structs.map((struct) => JSON.stringify(struct)).join("\n") + "\n";
    },
    footer() {
      return "";
    },
  };
}

export function createJSONFormatter(): Formatter {
  let len = 0;
  return {
    type: "json",
    header() {
      return "[";
    },
    async rows({ structs }) {
      const prefix = len === 0 ? "" : ",";
      len += structs.length;
      return prefix + structs.map((struct) => JSON.stringify(struct)).join(",");
    },
    footer() {
      return "]\n";
    },
  };
}

export function createCSVFormatter({
  options,
}: {
  options: CSV.Options;
}): Formatter {
  return {
    type: "csv",
    header() {
      return "";
    },
    async rows({ flat, structs }) {
      if (structs.length === 0) {
        return "";
      }
      return await new Promise<string>((resolve, reject) => {
        CSV.stringify(
          flat.toHashes({
            structs,
            transform: (p) => (p === null ? "" : `${p}`),
          }),
          options,
          (err?: Error, res?: string) => {
            if (err) {
              reject(err);
              return;
            }
            if (res) {
              resolve(res);
            }
          }
        );
      });
    },
    footer() {
      return "";
    },
  };
}
