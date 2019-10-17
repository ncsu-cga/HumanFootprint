const censusblockinfo = [{
    "Housing": [
        {"fieldName": "CM7AA2000", "dataType": "Double", "description": "Estimate of the Number of Housing Units in 2000"},
        {"fieldName": "CM7AA2010", "dataType": "Long", "description": "Estimate of the Number of Housing Units in 2010"},
        {"fieldName": "HD1Y90", "dataType": "Float", "description": "Housing Density (Units/Hectare) in 1990 based on Total Shape_area"},
        {"fieldName": "HD1Y00", "dataType": "Float", "description": "Housing Density (Units/Hectare) in 2000 based on Total Shape_area"},
        {"fieldName": "HD1Y10", "dataType": "Float", "description": "Housing Density (Units/Hectare) in 2010 based on Total Shape_area"},
        {"fieldName": "HD2Y90", "dataType": "Float", "description": "Housing Density (Units/Hectare) in 1990 based on NPOS_AREA after Discounting Public Open Spaces"},
        {"fieldName": "HD2Y00", "dataType": "Float", "description": "Housing Density (Units/Hectare) in 2000 based on NPOS_AREA after Discounting Public Open Spaces"},
        {"fieldName": "HD2Y10", "dataType": "Float", "description": "Housing Density (Units/Hectare) in 2010 based on NPOS_AREA after Discounting Public Open Spaces"},
        {"fieldName": "HDC1Y90", "dataType": "Long", "description": "Housing Density Class in 1990 (1=Rural; 2=Exurban; 3=Suburban; 4=Urban)"},
        {"fieldName": "HDC1Y00", "dataType": "Long", "description": "Housing Density Class in 2000 (1=Rural; 2=Exurban; 3=Suburban; 4=Urban)"},
        {"fieldName": "HDC1Y10", "dataType": "Long", "description": "Housing Density Class in 2010 (1=Rural; 2=Exurban; 3=Suburban; 4=Urban)"},
        {"fieldName": "HDC2Y90", "dataType": "Long", "description": "Housing Density Class in 1990 (1=Rural; 2=Exurban; 3=Suburban; 4=Urban) after Discounting Public Open Spaces"},
        {"fieldName": "HDC2Y00", "dataType": "Long", "description": "Housing Density Class in 2000 (1=Rural; 2=Exurban; 3=Suburban; 4=Urban) after Discounting Public Open Spaces"},
        {"fieldName": "HDC2Y10", "dataType": "Long", "description": "Housing Density Class in 2010 (1=Rural; 2=Exurban; 3=Suburban; 4=Urban) after Discounting Public Open Spaces"},
        {"fieldName": "HDT1Y9000", "dataType": "Text", "description": "Housing Density Class Transition 1990-2000"},
        {"fieldName": "HDT1Y0010", "dataType": "Text", "description": "Housing Density Class Transition 2000-2010"},
        {"fieldName": "HDT1Y9010", "dataType": "Text", "description": "Housing Density Class Transition 1990-2010"},
        {"fieldName": "HDT2Y9000", "dataType": "Text", "description": "Housing Density Class Transition 1990-2000 after Discounting Public Open Spaces"},
        {"fieldName": "HDT2Y0010", "dataType": "Text", "description": "Housing Density Class Transition 2000-2010 after Discounting Public Open Spaces"},
        {"fieldName": "HDT2Y9010", "dataType": "Text", "description": "Housing Density Class Transition 1990-2010 after Discounting Public Open Spaces"},
        {"fieldName": "HHCHANGE", "dataType": "Float", "description": "Percent Change in Number of Housing Units between 2000 and 2010"}, 
        {"fieldName": "HU90", "dataType": "Float", "description": "Estimate of the Number of Housing Units in 1990"}
     ],
    "Impervious Surface": [
        {"fieldName": "IAC01NPOS", "dataType": "Float", "description": "Acres of Impervious Surface in 2001 after Discounting Public Open Spaces"},
        {"fieldName": "IAC11NPOS", "dataType": "Float", "description": "Acres of Impervious Surface in 2011 after Discounting Public Open Spaces"},
        {"fieldName": "IAR_NPOS", "dataType": "Double", "description": "Annual Growth Rate of Impervious Surface for 2001 to 2011 Time Period after Discounting Public Open Spaces and for All Records with IAC01NPOS > 0"},
        {"fieldName": "IGR_NPOS", "dataType": "Double", "description": "Percent Change in Acres of Impervious Surface between 2001 to 2011 after Discounting Public Open Spaces and for All Records with IAC01NPOS > 0"},
        {"fieldName": "IMPAC", "dataType": "Float", "description": "Acres of Impervious Surface in 2011"},
        {"fieldName": "IMPAC01", "dataType": "Float", "description": "Acres of Impervious Surface in 2001"},
        {"fieldName": "IMPGRORATE", "dataType": "Float", "description": "Percent Change in Acres of Impervious Surface between 2001 to 2011 for All Records with IMPAC01 > 0"},
        {"fieldName": "IMPANNRATE", "dataType": "Float", "description": "Annual Growth Rate of Impervious Surface for 2001 to 2011 Time Period for All Records with IMPAC01 > 0"},
        {"fieldName": "PCTIMP", "dataType": "Float", "description": "Percent of Total Area Comprised of Impervious Surface in 2011"}, 
        {"fieldName": "PCTIMP01", "dataType": "Float", "description": "Percent of Total Area Comprised of Impervious Surface in 2001"},
        {"fieldName": "PCTNEWIMP", "dataType": "Float", "description": "Percentage of 2011 Impervious Surface that is Post-2001 for all records with IMPAC > 0"}
    ],
    "Land-Use Efficiency": [
        {"fieldName": "ILUE3NPOS", "dataType": "Double", "description": "Land-use Efficiency or the Ratio of IAR_NPOS to POPANNRATE for All Records with POPANNRATE Not Equal To 0"},
        {"fieldName": "IMPLUEFF3", "dataType": "Double", "description": "Land-use Efficiency or the Ratio of IMPANNRATE to POPANNRATE for All Records with POPANNRATE Not Equal To 0"}
    ],
    "Per Capita Consumption": [
        {"fieldName": "IAP00NPOS", "dataType": "Float", "description": "Acres of Impervious Surface Per Person in 2000 after Discounting Public Open Spaces"},
        {"fieldName": "IAP10NPOS", "dataType": "Float", "description": "Acres of Impervious Surface Per Person in 2010 after Discounting Public Open Spaces"},
        {"fieldName": "IMPACPP00", "dataType": "Float", "description": "Acres of Impervious Surface Per Person in 2000"},
        {"fieldName": "IMPACPP10", "dataType": "Float", "description": "Acres of Impervious Surface Per Person in 2010"},
        {"fieldName": "PCTINCACPP", "dataType": "Float", "description": "Percent Change in Acres of Impervious Surface Per Person between 2001 to 2011 for All Records with IMPACPP00 > 0"},
        {"fieldName": "PIAP_NPOS", "dataType": "Float", "description": "Percent Change in Acres of Impervious Surface Per Person between 2001 to 2011 after Discounting Public Open Spaces and for All Records with IAP00NPOS > 0"}
    ],
    "Population": [
        {"fieldName": "POP00", "dataType": "Float", "description": "Population Count based on 2000 Census Estimates"},
        {"fieldName": "POP10", "dataType": "Float", "description": "Population Count based on 2010 Census Estimates"},
        {"fieldName": "POP90", "dataType": "Float", "description": "Estimate of the Population Count in 1990"},
        {"fieldName": "POPANNRATE", "dataType": "Float", "description": "Annual Population Growth Rate for 2000 to 2010 Time Period for All Records with POP00 >= 1"},
        {"fieldName": "POPGRORATE", "dataType": "Float", "description": "Percent Change in Population between 2000 to 2010 for All Records with POP00 >= 1"}
    ]
}]




















