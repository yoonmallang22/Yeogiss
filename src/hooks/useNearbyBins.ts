import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getNearbyBins, type Bin, type GetNearByBins } from '@/lib/api/bin';

/**
 * 가까운 쓰레기통 리스트 api를 호출하는 커스텀 훅
 */
const useNearbyBins = (
  args: Parameters<GetNearByBins>,
  options?: Omit<UseQueryOptions<Bin[]>, 'queryKey' | 'queryFn'>
) => {
  const [lat, lng, radius] = args;

  return useQuery({
    queryKey: ['nearbyBins', lat, lng, radius],
    queryFn: () => getNearbyBins(...args),
    enabled: Boolean(lat && lng),
    ...options,
  });
};

export default useNearbyBins;
