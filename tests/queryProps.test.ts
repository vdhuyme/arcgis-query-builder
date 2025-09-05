import Query from "@arcgis/core/rest/support/Query.js";
import { QueryProps } from "../src/query/QueryProps";

jest.mock("@arcgis/core/rest/support/Query.js", () => ({
  __esModule: true,
  default: class QueryMock {
    [key: string]: any;
    constructor(init: any = {}) {
      Object.assign(this, init);
    }
    clone() {
      return { ...this } as any;
    }
  },
}));

describe("QueryProps", () => {
  it("sets various query properties", () => {
    const q = new Query({ where: "1=1" });
    const props = new QueryProps(q);

    props
      .cacheHint(true)
      .datumTransformation(123)
      .distance(10)
      .gdbVersion("v1")
      .geometryPrecision(2)
      .having("sum(pop) > 0")
      .historicMoment(new Date("2020-01-01"))
      .maxAllowableOffset(5)
      .maxRecordCountFactor(2)
      .multipatchOption("xy")
      .objectIds([1, 2])
      .outSpatialReference({} as any)
      .parameterValues({ a: 1 })
      .pixelSize({} as any)
      .quantizationParameters({ level: 1 })
      .rangeValues([1])
      .relationParameter("REL")
      .returnCentroid(true)
      .returnExceededLimitFeatures(true)
      .returnM(true)
      .returnQueryGeometry(true)
      .returnZ(true)
      .sqlFormat("native")
      .textLike("hello")
      .timeExtent({} as any)
      .units("meters");

    expect((q as any).cacheHint).toBe(true);
    expect((q as any).datumTransformation).toBe(123);
    expect((q as any).distance).toBe(10);
    expect((q as any).gdbVersion).toBe("v1");
    expect((q as any).geometryPrecision).toBe(2);
    expect((q as any).having).toBe("sum(pop) > 0");
    expect((q as any).historicMoment).toBeInstanceOf(Date);
    expect((q as any).maxAllowableOffset).toBe(5);
    expect((q as any).maxRecordCountFactor).toBe(2);
    expect((q as any).multipatchOption).toBe("xy");
    expect((q as any).objectIds).toEqual([1, 2]);
    expect((q as any).outSpatialReference).toEqual({});
    expect((q as any).parameterValues).toEqual({ a: 1 });
    expect((q as any).pixelSize).toEqual({});
    expect((q as any).quantizationParameters).toEqual({ level: 1 });
    expect((q as any).rangeValues).toEqual([1]);
    expect((q as any).relationParameter).toBe("REL");
    expect((q as any).returnCentroid).toBe(true);
    expect((q as any).returnExceededLimitFeatures).toBe(true);
    expect((q as any).returnM).toBe(true);
    expect((q as any).returnQueryGeometry).toBe(true);
    expect((q as any).returnZ).toBe(true);
    expect((q as any).sqlFormat).toBe("native");
    expect((q as any).text).toBe("hello");
    expect((q as any).timeExtent).toEqual({});
    expect((q as any).units).toBe("meters");
  });
});
