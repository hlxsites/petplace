import { Title } from "~/components/design-system";

export const TitlePlayground = () => {
  return (
    <div className="grid gap-xxlarge">
      <div>
        <Title level="h1">regular h1</Title>
        <Title level="h2">regular h2</Title>
        <Title level="h3">regular h3</Title>
        <Title level="h4">regular h4</Title>
        <Title level="h5">regular h5</Title>
      </div>

      <div>
        <Title level="h1" size="12">
          h1 with size 12
        </Title>
        <Title level="h1" size="14">
          h1 with size 14
        </Title>
        <Title level="h1" size="16">
          h1 with size 16
        </Title>
        <Title level="h1" size="18">
          h1 with size 18
        </Title>
        <Title level="h1" size="20">
          h1 with size 20
        </Title>
        <Title level="h1" size="24">
          h1 with size 24
        </Title>
        <Title level="h1" size="28">
          h1 with size 28
        </Title>
        <Title level="h1" size="32">
          h1 with size 32
        </Title>
        <Title level="h1" size="36">
          h1 with size 36
        </Title>
        <Title level="h1" size="40">
          h1 with size 40
        </Title>
        <Title level="h1" size="44">
          h1 with size 44
        </Title>
      </div>

      <div>
        <Title isResponsive>responsive desktop:44 mobile:24</Title>
        <Title size="36" isResponsive>
          responsive desktop:36 mobile:24
        </Title>
        <Title size="32" isResponsive>
          responsive desktop:32 mobile:24
        </Title>
        <Title size="24" isResponsive>
          responsive desktop:24 mobile:18
        </Title>
        <Title size="16" isResponsive>
          responsive desktop:16 mobile:14
        </Title>
      </div>
    </div>
  );
};
