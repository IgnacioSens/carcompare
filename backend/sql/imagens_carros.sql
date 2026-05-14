-- Atualização das imagens dos 50 carros
-- Fonte: Wikimedia Commons (uso livre)

UPDATE carros SET imagem_url = CASE id

  -- HATCHES / COMPACTOS
  WHEN 'cc000001-0000-0000-0000-000000000000' THEN -- Toyota Yaris
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/2020_Toyota_Yaris_XS_Sedan_%28Brazil%29%2C_front_8.18.20.jpg/1280px-2020_Toyota_Yaris_XS_Sedan_%28Brazil%29%2C_front_8.18.20.jpg'

  WHEN 'cc000002-0000-0000-0000-000000000000' THEN -- Honda Fit
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2014_Honda_Jazz_%28GE8%29_1.5_i-VTEC_facelift%2C_front_8.30.13.jpg/1280px-2014_Honda_Jazz_%28GE8%29_1.5_i-VTEC_facelift%2C_front_8.30.13.jpg'

  WHEN 'cc000003-0000-0000-0000-000000000000' THEN -- Volkswagen Polo
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/2018_Volkswagen_Polo_SE_TSI_1.0_Front.jpg/1280px-2018_Volkswagen_Polo_SE_TSI_1.0_Front.jpg'

  WHEN 'cc000004-0000-0000-0000-000000000000' THEN -- Fiat Argo
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Fiat_Argo_HGT_1.8_%28Brazil%2C_2018%29_front.jpg/1280px-Fiat_Argo_HGT_1.8_%28Brazil%2C_2018%29_front.jpg'

  WHEN 'cc000005-0000-0000-0000-000000000000' THEN -- Chevrolet Onix
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Chevrolet_Onix_2020_LT_Turbo.jpg/1280px-Chevrolet_Onix_2020_LT_Turbo.jpg'

  WHEN 'cc000006-0000-0000-0000-000000000000' THEN -- Renault Sandero
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Renault_Sandero_Stepway_2013_%28front%29.jpg/1280px-Renault_Sandero_Stepway_2013_%28front%29.jpg'

  WHEN 'cc000007-0000-0000-0000-000000000000' THEN -- MINI Cooper S
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/2019_Mini_Cooper_S_%28F56%2C_facelift%29%2C_front_8.15.19.jpg/1280px-2019_Mini_Cooper_S_%28F56%2C_facelift%29%2C_front_8.15.19.jpg'

  WHEN 'cc000008-0000-0000-0000-000000000000' THEN -- Hyundai HB20
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Hyundai_HB20_2020_front.jpg/1280px-Hyundai_HB20_2020_front.jpg'

  WHEN 'cc000009-0000-0000-0000-000000000000' THEN -- Mazda2
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/2020_Mazda2_1.5_Sedan_%28Thailand%29%2C_front_8.16.20.jpg/1280px-2020_Mazda2_1.5_Sedan_%28Thailand%29%2C_front_8.16.20.jpg'

  WHEN 'cc000010-0000-0000-0000-000000000000' THEN -- Kia Rio
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/2017_Kia_Rio_1.4_EX_%28facelift%2C_Korea%29%2C_front_8.23.17.jpg/1280px-2017_Kia_Rio_1.4_EX_%28facelift%2C_Korea%29%2C_front_8.23.17.jpg'

  -- SEDÃS
  WHEN 'cc000011-0000-0000-0000-000000000000' THEN -- Toyota Corolla
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/2019_Toyota_Corolla_XSE_%28facelift%2C_US%29%2C_front_9.24.19.jpg/1280px-2019_Toyota_Corolla_XSE_%28facelift%2C_US%29%2C_front_9.24.19.jpg'

  WHEN 'cc000012-0000-0000-0000-000000000000' THEN -- Honda Civic
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/2022_Honda_Civic_Sport%2C_front_5.21.22.jpg/1280px-2022_Honda_Civic_Sport%2C_front_5.21.22.jpg'

  WHEN 'cc000013-0000-0000-0000-000000000000' THEN -- Volkswagen Virtus
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/VW_Virtus_2022.jpg/1280px-VW_Virtus_2022.jpg'

  WHEN 'cc000014-0000-0000-0000-000000000000' THEN -- Chevrolet Onix Plus
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Chevrolet_Onix_Plus_2020_Premier_Turbo.jpg/1280px-Chevrolet_Onix_Plus_2020_Premier_Turbo.jpg'

  WHEN 'cc000015-0000-0000-0000-000000000000' THEN -- Nissan Sentra
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/2020_Nissan_Sentra_SR%2C_front_2.19.20.jpg/1280px-2020_Nissan_Sentra_SR%2C_front_2.19.20.jpg'

  -- SEDÃS PREMIUM
  WHEN 'cc000016-0000-0000-0000-000000000000' THEN -- Mazda3
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/2019_Mazda3_Sedan_2.0_%28Thailand%29%2C_front_8.21.19.jpg/1280px-2019_Mazda3_Sedan_2.0_%28Thailand%29%2C_front_8.21.19.jpg'

  WHEN 'cc000017-0000-0000-0000-000000000000' THEN -- BMW 320i
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/2019_BMW_320i_M_Sport_%28G20%29%2C_front_8.18.19.jpg/1280px-2019_BMW_320i_M_Sport_%28G20%29%2C_front_8.18.19.jpg'

  WHEN 'cc000018-0000-0000-0000-000000000000' THEN -- Mercedes C 200
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/2021_Mercedes-Benz_C200_AMG_Line_%28W206%29%2C_front_8.21.21.jpg/1280px-2021_Mercedes-Benz_C200_AMG_Line_%28W206%29%2C_front_8.21.21.jpg'

  WHEN 'cc000019-0000-0000-0000-000000000000' THEN -- Audi A4
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2020_Audi_A4_S_Line_35_TFSI_S-A%2C_front_8.18.20.jpg/1280px-2020_Audi_A4_S_Line_35_TFSI_S-A%2C_front_8.18.20.jpg'

  WHEN 'cc000020-0000-0000-0000-000000000000' THEN -- Lexus IS 300
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/2021_Lexus_IS_300_F_Sport_%28US%29%2C_front_5.3.21.jpg/1280px-2021_Lexus_IS_300_F_Sport_%28US%29%2C_front_5.3.21.jpg'

  -- SUVs COMPACTOS
  WHEN 'cc000021-0000-0000-0000-000000000000' THEN -- Toyota RAV4
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/2019_Toyota_RAV4_Adventure_%28US%29%2C_front_3.5.19.jpg/1280px-2019_Toyota_RAV4_Adventure_%28US%29%2C_front_3.5.19.jpg'

  WHEN 'cc000022-0000-0000-0000-000000000000' THEN -- Honda CR-V
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/2020_Honda_CR-V_EX-L_AWD%2C_front_6.1.20.jpg/1280px-2020_Honda_CR-V_EX-L_AWD%2C_front_6.1.20.jpg'

  WHEN 'cc000023-0000-0000-0000-000000000000' THEN -- Hyundai Tucson
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/2022_Hyundai_Tucson_%28NX4%29_2.0_MPi%2C_front_8.16.22.jpg/1280px-2022_Hyundai_Tucson_%28NX4%29_2.0_MPi%2C_front_8.16.22.jpg'

  WHEN 'cc000024-0000-0000-0000-000000000000' THEN -- Jeep Renegade
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Jeep_Renegade_2019_front.jpg/1280px-Jeep_Renegade_2019_front.jpg'

  WHEN 'cc000025-0000-0000-0000-000000000000' THEN -- Jeep Compass
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/2021_Jeep_Compass_80th_Anniversary_%28US%29%2C_front_6.4.21.jpg/1280px-2021_Jeep_Compass_80th_Anniversary_%28US%29%2C_front_6.4.21.jpg'

  WHEN 'cc000030-0000-0000-0000-000000000000' THEN -- Kia Sportage
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/2022_Kia_Sportage_EX_AWD%2C_front_8.12.22.jpg/1280px-2022_Kia_Sportage_EX_AWD%2C_front_8.12.22.jpg'

  WHEN 'cc000033-0000-0000-0000-000000000000' THEN -- Subaru Forester
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/2019_Subaru_Forester_2.5i_Premium%2C_front_3.15.19.jpg/1280px-2019_Subaru_Forester_2.5i_Premium%2C_front_3.15.19.jpg'

  WHEN 'cc000034-0000-0000-0000-000000000000' THEN -- Ford Bronco Sport
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2021_Ford_Bronco_Sport_Outer_Banks%2C_front_11.22.20.jpg/1280px-2021_Ford_Bronco_Sport_Outer_Banks%2C_front_11.22.20.jpg'

  WHEN 'cc000035-0000-0000-0000-000000000000' THEN -- Chevrolet Trailblazer
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2021_Chevrolet_Trailblazer_RS%2C_front_4.25.20.jpg/1280px-2021_Chevrolet_Trailblazer_RS%2C_front_4.25.20.jpg'

  -- SUVs GRANDES / PREMIUM
  WHEN 'cc000026-0000-0000-0000-000000000000' THEN -- Land Rover Defender 110
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2020_Land_Rover_Defender_110_D240_SE%2C_front_8.20.20.jpg/1280px-2020_Land_Rover_Defender_110_D240_SE%2C_front_8.20.20.jpg'

  WHEN 'cc000027-0000-0000-0000-000000000000' THEN -- BMW X5
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/2019_BMW_X5_xDrive40i_%28G05%29%2C_front_10.24.19.jpg/1280px-2019_BMW_X5_xDrive40i_%28G05%29%2C_front_10.24.19.jpg'

  WHEN 'cc000028-0000-0000-0000-000000000000' THEN -- Mercedes GLE 450
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/2020_Mercedes-Benz_GLE_450_4MATIC_%28W167%29%2C_front_8.15.19.jpg/1280px-2020_Mercedes-Benz_GLE_450_4MATIC_%28W167%29%2C_front_8.15.19.jpg'

  WHEN 'cc000029-0000-0000-0000-000000000000' THEN -- Audi Q5
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2021_Audi_Q5_S_Line_40_TDI_Quattro%2C_front_8.7.21.jpg/1280px-2021_Audi_Q5_S_Line_40_TDI_Quattro%2C_front_8.7.21.jpg'

  WHEN 'cc000031-0000-0000-0000-000000000000' THEN -- Volvo XC60
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/2018_Volvo_XC60_D4_Inscription_AWD%2C_front_8.16.18.jpg/1280px-2018_Volvo_XC60_D4_Inscription_AWD%2C_front_8.16.18.jpg'

  WHEN 'cc000032-0000-0000-0000-000000000000' THEN -- Porsche Cayenne
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/2019_Porsche_Cayenne_S%2C_front_7.24.19.jpg/1280px-2019_Porsche_Cayenne_S%2C_front_7.24.19.jpg'

  -- PICAPES
  WHEN 'cc000036-0000-0000-0000-000000000000' THEN -- Toyota Hilux
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/2016_Toyota_HiLux_%28GUN126R%29_SR5_utility%2C_front_8.7.17.jpg/1280px-2016_Toyota_HiLux_%28GUN126R%29_SR5_utility%2C_front_8.7.17.jpg'

  WHEN 'cc000037-0000-0000-0000-000000000000' THEN -- Ford Ranger
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/2019_Ford_Ranger_Wildtrak_2.0_Bi-Turbo%2C_front_8.7.19.jpg/1280px-2019_Ford_Ranger_Wildtrak_2.0_Bi-Turbo%2C_front_8.7.19.jpg'

  WHEN 'cc000038-0000-0000-0000-000000000000' THEN -- Chevrolet S10
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Chevrolet_S10_2.8_Turbo_High_Country_%28Brazil%2C_2021%29_front.jpg/1280px-Chevrolet_S10_2.8_Turbo_High_Country_%28Brazil%2C_2021%29_front.jpg'

  WHEN 'cc000039-0000-0000-0000-000000000000' THEN -- Nissan Frontier
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/2022_Nissan_Frontier_Pro-4X%2C_front_5.3.22.jpg/1280px-2022_Nissan_Frontier_Pro-4X%2C_front_5.3.22.jpg'

  WHEN 'cc000040-0000-0000-0000-000000000000' THEN -- RAM 1500
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/2019_Ram_1500_Laramie%2C_front_8.3.19.jpg/1280px-2019_Ram_1500_Laramie%2C_front_8.3.19.jpg'

  WHEN 'cc000041-0000-0000-0000-000000000000' THEN -- Ford Maverick
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/2022_Ford_Maverick_XLT_%28US%29%2C_front_6.4.21.jpg/1280px-2022_Ford_Maverick_XLT_%28US%29%2C_front_6.4.21.jpg'

  WHEN 'cc000042-0000-0000-0000-000000000000' THEN -- Mitsubishi L200 Triton
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mitsubishi_L200_Triton_Sport_HPE-S_%28Brazil%2C_2019%29_front.jpg/1280px-Mitsubishi_L200_Triton_Sport_HPE-S_%28Brazil%2C_2019%29_front.jpg'

  -- ELÉTRICO / ESPECIAL
  WHEN 'cc000043-0000-0000-0000-000000000000' THEN -- Rivian R1T
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Rivian_R1T_launch_edition%2C_front_10.16.21.jpg/1280px-Rivian_R1T_launch_edition%2C_front_10.16.21.jpg'

  -- ESPORTIVOS / PERFORMANCE
  WHEN 'cc000044-0000-0000-0000-000000000000' THEN -- BMW M4 Competition
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/2021_BMW_M4_Competition_%28G82%29%2C_front_8.7.21.jpg/1280px-2021_BMW_M4_Competition_%28G82%29%2C_front_8.7.21.jpg'

  WHEN 'cc000045-0000-0000-0000-000000000000' THEN -- Mercedes AMG C 63 S
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/2019_Mercedes-AMG_C_63_S_%28W205%2C_facelift%29%2C_front_8.8.19.jpg/1280px-2019_Mercedes-AMG_C_63_S_%28W205%2C_facelift%29%2C_front_8.8.19.jpg'

  WHEN 'cc000046-0000-0000-0000-000000000000' THEN -- Audi RS5
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/2018_Audi_RS5_%28B9%29_2.9_TFSI%2C_front_8.5.18.jpg/1280px-2018_Audi_RS5_%28B9%29_2.9_TFSI%2C_front_8.5.18.jpg'

  WHEN 'cc000047-0000-0000-0000-000000000000' THEN -- Porsche 911 Carrera S
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/2019_Porsche_911_Carrera_S_%28992%29%2C_front_8.8.19.jpg/1280px-2019_Porsche_911_Carrera_S_%28992%29%2C_front_8.8.19.jpg'

  WHEN 'cc000048-0000-0000-0000-000000000000' THEN -- Alfa Romeo Giulia Quadrifoglio
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Alfa_Romeo_Giulia_Quadrifoglio_%28952%29%2C_front_8.10.19.jpg/1280px-Alfa_Romeo_Giulia_Quadrifoglio_%28952%29%2C_front_8.10.19.jpg'

  WHEN 'cc000049-0000-0000-0000-000000000000' THEN -- Mazda MX-5 Miata
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/2019_Mazda_MX-5_%28ND%2C_facelift%2C_UK%29%2C_front_8.18.19.jpg/1280px-2019_Mazda_MX-5_%28ND%2C_facelift%2C_UK%29%2C_front_8.18.19.jpg'

  WHEN 'cc000050-0000-0000-0000-000000000000' THEN -- Dodge Challenger SRT Hellcat
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/2019_Dodge_Challenger_SRT_Hellcat%2C_front_8.7.19.jpg/1280px-2019_Dodge_Challenger_SRT_Hellcat%2C_front_8.7.19.jpg'

  ELSE imagem_url
END;
