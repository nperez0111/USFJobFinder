var parseString = require( 'xml2js' ).parseString,
    fetch = require( 'isomorphic-fetch' ),
    grabber = () => fetch( 'https://www.usfjobs.com/all_jobs.atom' ).then( a => a.text() ).then( function ( data ) {
        return new Promise( function ( resolve, reject ) {
            parseString( data, function ( err, result ) {
                if ( err ) {
                    reject( err )
                }
                resolve( result )
            } )
        } )
    } ).catch( function ( a ) { console.warn( a ) } ).then( function ( data ) {
        return {
            updated: data.feed.updated[ 0 ],
            jobs: data.feed.entry.map( cur => {
                Object.keys( cur ).forEach( key => {

                    if ( key == 'link' ) {
                        cur[ key ] = [ cur[ key ][ 0 ][ '$' ] ]
                    }
                    if ( key == 'author' ) {
                        cur[ key ] = [ cur[ key ][ 0 ].name[ 0 ] ]
                    }

                    cur[ key ] = cur[ key ][ 0 ]
                } )
                return cur
            } )
        }
    } ).then( da => { console.log( JSON.stringify( da, ( a, b ) => b, 2 ) ) } )
module.exports = grabber
if ( !module.parent ) {
    grabber()
}
