import Layout from "@/components/Layout";
import Topic from "@/components/Topic";

export default function Recent() {
  return (
    <Layout>
      <h1 className="text-3xl font-semibold my-4">新着まとめ</h1>
      <Topic id="123" title="Moisskey始動！" pv={9} published={new Date()} />
    </Layout>
  );
}
