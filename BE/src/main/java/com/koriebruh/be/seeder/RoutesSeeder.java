package com.koriebruh.be.seeder;

import com.koriebruh.be.dto.CityRequest;
import com.koriebruh.be.dto.RouteRequest;
import com.koriebruh.be.entity.City;
import com.koriebruh.be.repository.CityRepository;
import com.koriebruh.be.service.CityService;
import com.koriebruh.be.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RoutesSeeder implements CommandLineRunner {


    @Autowired
    private RouteService routeService;

    @Autowired
    private CityRepository cityRepository;

    @Override
    public void run(String... args) throws Exception {
        seederCity();
    }

    public void seederCity() {
        Long currentTime = Instant.now().getEpochSecond();
        String COUNTRY = "Indonesia";

        List<CityRequest> cityData = List.of(
                /// LIST WILL BE SEEDER FOR ROUTE
                // dieng -> jakarta
                new CityRequest("Dieng", -7.2094, 109.9234, COUNTRY),
                new CityRequest("Jakarta", -6.1754, 106.8272, COUNTRY),
                new CityRequest("Kramat Jati", -6.2755, 106.8704, COUNTRY),
                new CityRequest("Cikopo", -7.3707, 107.6749, COUNTRY),
                new CityRequest("Cibitung", -6.2619, 107.0837, COUNTRY),
                new CityRequest("Tanah Tinggi", -6.1806, 106.8483, COUNTRY),

                new CityRequest("Surabaya", -7.2575, 112.7521, COUNTRY),
                new CityRequest("Kemang Bogor", -6.52333, 106.55667, COUNTRY),
                new CityRequest("Nongko Jajar", -7.942, 112.95, COUNTRY),
                new CityRequest("Mojokerto", -7.4664, 112.4338, COUNTRY),
                new CityRequest("Jombang", -7.53833, 112.23806, COUNTRY),
                new CityRequest("Blitar", -8.0983, 112.1681, COUNTRY),

                new CityRequest("Cirebon", -6.737246, 108.550659, COUNTRY),
                new CityRequest("Subang", -6.571589, 107.758736, COUNTRY),
                new CityRequest("Majalengka", -6.83528, 108.22778, COUNTRY),
                new CityRequest("Patrol", -6.313084, 107.982597, COUNTRY),
                new CityRequest("Indramayu", -6.3265, 108.3228, COUNTRY),

                new CityRequest("Batang", -6.90814, 109.73037, COUNTRY),
                new CityRequest("Pekalongan", -6.88870, 109.66829, COUNTRY),
                new CityRequest("Boja", -7.10444, 110.27278, COUNTRY),
                new CityRequest("Pemalang", -6.89056, 109.38083, COUNTRY),
                new CityRequest("Tegal", -6.86750, 109.13750, COUNTRY),
                new CityRequest("Brebes", -6.89234, 109.02695, COUNTRY),
                new CityRequest("Banjarnegara", -7.39611, 109.75750, COUNTRY),
                new CityRequest("Purbalingga", -7.39028, 109.36111, COUNTRY),
                new CityRequest("Banyumas", -7.42500, 109.23222, COUNTRY),
                new CityRequest("Gunung Kidul", -7.90000, 110.40000, COUNTRY),
                new CityRequest("Sragen", -7.41833, 111.02611, COUNTRY),
                new CityRequest("Wonogiri", -7.80000, 110.91500, COUNTRY),
                new CityRequest("Kudus", -6.80944, 110.84167, COUNTRY),
                new CityRequest("Pati", -6.73139, 111.01528, COUNTRY),
                new CityRequest("Jepara", -6.58611, 110.67000, COUNTRY),
                new CityRequest("Rembang", -6.73333, 111.39000, COUNTRY),

                new CityRequest("Serang", -6.12000, 106.15028, COUNTRY),
                new CityRequest("Menes", -6.37600, 105.91840, COUNTRY),
                new CityRequest("Ujung Kulon", -6.70472, 105.38111, COUNTRY),
                new CityRequest("Kendal", -6.88944, 110.14750, COUNTRY),
                new CityRequest("Semarang", -6.96667, 110.41667, COUNTRY),
                new CityRequest("Temanggung", -7.27500, 110.15306, COUNTRY),
                new CityRequest("Solo", -7.56667, 110.81667, COUNTRY),
                new CityRequest("Jogja", -7.79722, 110.36972, COUNTRY),

                new CityRequest("Purwokerto", -7.41667, 109.25000, COUNTRY),
                new CityRequest("Purbalingga", -7.39028, 109.36111, COUNTRY),
                new CityRequest("Pasuruan", -7.64250, 112.90417, COUNTRY),
                new CityRequest("Bangkalan", -7.07139, 112.80139, COUNTRY),
                new CityRequest("Sumenep", -7.03333, 113.88444, COUNTRY),
                new CityRequest("Bantul", -7.90000, 110.36000, COUNTRY),
                new CityRequest("Kebumen", -7.66944, 109.64444, COUNTRY),

                new CityRequest("Kutosari/Luwung", -6.97044, 109.67329, COUNTRY),
                new CityRequest("Kutosari/Ambon", -6.97044, 109.67329, COUNTRY),
                new CityRequest("Pielen", 0.36694, 127.90000, COUNTRY),
                new CityRequest("Wonosobo Tambang", -7.35980, 109.91815, COUNTRY),
                new CityRequest("Wonosobo Dipo", -7.35980, 109.91815, COUNTRY),
                new CityRequest("Muntilan Tambang", -7.34300, 110.23800, COUNTRY),
                new CityRequest("Muntilan Dipo", -7.34300, 110.23800, COUNTRY),

                new CityRequest("Denpasar, Bali", -8.65000, 115.21667, COUNTRY),
                new CityRequest("Mataram, NTB", -8.58333, 116.11667, COUNTRY),
                new CityRequest("Bima, NTB", -8.46057, 118.72740, COUNTRY)

                );


        for (CityRequest cityRequest : cityData) {
            boolean exists = cityRepository.existsByName(cityRequest.getName());
            if (!exists) {
                City city = new City();
                city.setName(cityRequest.getName());
                city.setLatitude(cityRequest.getLatitude());
                city.setLongitude(cityRequest.getLongitude());
                city.setCountry(cityRequest.getCountry());
                city.setCreatedAt(currentTime);

                cityRepository.save(city);
                System.out.println("Seeded city: " + city.getName());
            } else {
                System.out.println("Skipping existing city: " + cityRequest.getName());
            }
        }
    }

    public void seederRoute(){
        List<RouteRequest> routeRequests = List.of(
                new RouteRequest()
        );
    }


}
