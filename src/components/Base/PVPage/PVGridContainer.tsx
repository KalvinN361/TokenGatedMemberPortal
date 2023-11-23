import styled from 'styled-components';
import tw from 'twin.macro';

type PVGridContainerProps<
    P = {
        children?: React.ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        columns: 3 | 4 | 6 | 8;
    },
> = P;

export const PVGridContainer: React.FC<PVGridContainerProps> = (props) => {
    const { className, id, children, columns } = props;
    return (
        <PVGridContainerStyled className={className} id={id}>
            <PVItemsGrid columns={columns}>{children}</PVItemsGrid>
        </PVGridContainerStyled>
    );
};

const PVGridContainerStyled = styled.div`
    ${tw`h-full w-full mx-auto max-w-2xl lg:max-w-7xl overflow-auto px-2 relative`}
`;

type PVItemsGridProps<P = { columns: 3 | 4 | 6 | 8 }> = P;

const PVItemsGrid = styled.div<PVItemsGridProps>(({ columns }) => [
    tw`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 overflow-auto`,
    columns === 3 && tw`xl:grid-cols-3`,
    columns === 4 && tw`xl:grid-cols-4`,
    columns === 6 && tw`xl:grid-cols-6`,
]);
